import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material'

import { Subscription } from 'rxjs/Subscription';

import { FirebaseError } from 'firebase/app';

import * as d3 from 'd3';

import { Flow, FlowConnection, FlowIdea } from './models';
import { FlowService } from './flow.service';
import { NotificationService } from '../core/notification.service';
import { IdeaEditDialogComponent } from './idea-edit-dialog/idea-edit-dialog.component';
import { FlowEditDialogComponent } from './flow-edit-dialog/flow-edit-dialog.component';

const LINKS: FlowConnection[] = [
  new FlowConnection(0, 1, 50, 0.1),
  new FlowConnection(0, 2, 50, 1),
  new FlowConnection(1, 3, 100, 2)
];

const NODES: FlowIdea[] = [
  new FlowIdea(0, 225, 100, 30, '#FFB300', 'Bob'),
  new FlowIdea(1, 400, 300, 30, '#FFB300', 'Jerry'),
  new FlowIdea(2, 500, 500, 30, '#ffff00', 'John'),
  new FlowIdea(3, 800, 100, 30, '#00ff00', 'George')
];

@Component({
  selector: 'flow',
  styleUrls: ['./flow.component.css'],
  templateUrl: './flow.component.html',
})
export class FlowComponent implements AfterViewInit {
  public flow: Flow;
  public flows: Flow[] = [];
  public mobileQuery: MediaQueryList;
  public sideNavFixed: boolean;
  public sideNavMode: string;
  public sideNavOpen: boolean;
  private contextMenuBtn: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  private flowSubscription: Subscription;
  private link: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  private mobileQueryListener: () => void;
  private node: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  private simulation: d3.Simulation<FlowIdea, FlowConnection>;
  private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private flowSvc: FlowService,
    private media: MediaMatcher,
    private notifySvc: NotificationService
  ) {
    this.mobileQueryListener = () => {
      this.setSideNav();
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.setSideNav();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  public addFlow(): void {
    const newFlow: Flow = new Flow([], [], '');
    const flowEditDialog: MatDialogRef<FlowEditDialogComponent> = this.dialog.open(FlowEditDialogComponent, {
      data: {
        flow: newFlow
      }
    });

    flowEditDialog.afterClosed().toPromise().then((flow: Flow) => {
      if (!!flow) {
        this.flowSvc.saveFlow(flow);
      }
    })
  }

  public addIdea(): void {
    const newFlowIdea: FlowIdea = new FlowIdea('', 0, 0, 30, '#FFC107', '');
    const ideaEditDialog: MatDialogRef<IdeaEditDialogComponent> = this.dialog.open(IdeaEditDialogComponent, {
      data: {
        connections: [],
        idea: newFlowIdea,
        ideas: this.flow.ideas
      }
    });

    ideaEditDialog.afterClosed().toPromise().then((data: { idea: FlowIdea, connections: FlowConnection[] }) => {
      if (data) {
        this.flow.ideas.push(data.idea);
        this.flow.connections.push(...data.connections);
        console.log(this.flow)
        this.flowSvc.saveFlow(this.flow);
      }
    })
  }

  public closeMenu(): void {
    this.menuTrigger.closeMenu();
  }

  public editFlow(flow: Flow): void {
    const flowEditDialog: MatDialogRef<FlowEditDialogComponent> = this.dialog.open(FlowEditDialogComponent, {
      data: {
        flow
      }
    });
  }

  public onMenuClosed(): void {
    this.contextMenuBtn.style('display', 'none');
  }

  public onSideNavToggle(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  public removeFlow(flow: Flow): void {
    this.flowSvc.removeFlow(flow);
  }

  public selectFlow(flow: Flow): void {
    this.flow = flow;
  }

  ngAfterViewInit(): void {
    this.contextMenuBtn = d3.select('#contextMenuBtn');
    this.svg = d3.select('.flowChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('width', '100%')
      .attr('height', '100%')
      .on('contextmenu', () => {
        d3.event.preventDefault();
        this.contextMenuBtn.style('display', '');
        this.contextMenuBtn.style('left', `${d3.event.clientX - 256}px`);
        this.contextMenuBtn.style('top', `${d3.event.clientY - 64}px`);
        this.menuTrigger.toggleMenu();
      })
      .call(d3.zoom()
        .on('zoom', () => {
          this.svg.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k})`);
        })
      );

    const rect = this.svg
      .append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', 'none')
      .style('pointer-events', 'all');

    const container = this.svg.append('g');

    setTimeout(() => this.setupFlow(), 10);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.flowSubscription.unsubscribe();
  }

  private setSideNav(): void {
    this.sideNavFixed = this.mobileQuery.matches;
    this.sideNavMode = this.mobileQuery.matches ? 'over' : 'side';
    this.sideNavOpen = !this.mobileQuery.matches;
  }

  private setupFlow(): void {
    this.notifySvc.showLoading();
    this.flowSubscription = this.flowSvc.getFlows().subscribe((flows: Flow[]) => {
      if (!!flows && flows['$value'] !== null) {
        this.notifySvc.closeLoading();
        this.flows = [...flows];
        this.flow = this.flows[0] || new Flow([], [], '');
        this.flow.ideas = this.flow.ideas || [];
        this.flow.connections = this.flow.connections || [];
        if (!!this.flow.connections.length && !!this.flow.ideas.length) {
          this.setupForceLayout();
          this.setupLinks();
          this.setupNodes();

          this.simulation.on('tick', () => {
            this.link.attr('x1', (d: FlowConnection) => (<FlowIdea>d.source).x)
              .attr('y1', (d: FlowConnection) => (<FlowIdea>d.source).y)
              .attr('x2', (d: FlowConnection) => (<FlowIdea>d.target).x)
              .attr('y2', (d: FlowConnection) => (<FlowIdea>d.target).y);

            this.node.attr('transform', (d: FlowIdea) => `translate(${d.x},${d.y})`);
          });
        }
      }
    }, (err: FirebaseError) => {
      this.notifySvc.closeLoading();
      this.notifySvc.showError(err.message);
    });
  }

  private setupForceLayout(): void {
    this.simulation = d3.forceSimulation(this.flow.ideas).alphaDecay(0.01)
      .velocityDecay(0.55)
      .force('link', d3.forceLink(this.flow.connections)
        .distance((l: FlowConnection) => l.distance)
        .strength((l: FlowConnection) => l.strength)
      )
      .force('charge', d3.forceManyBody().strength(-100).distanceMin(10000))
      .force('collide', d3.forceCollide(45).strength(1));
  }

  private setupLinks(): void {
    this.link = this.svg.selectAll('line')
      .data(this.flow.connections)
      .enter().append('line')
      .attr('stroke', 'rgba(255, 255, 255, .5)')
      .attr('stroke-width', '1px');
  }

  private setupNodes(): void {
    this.node = this.svg.selectAll('.node')
      .data(this.flow.ideas)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (d: FlowIdea) => {
          if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d: FlowIdea) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d: FlowIdea) => {
          if (!d3.event.active) {
            this.simulation.alphaTarget(0);
          }
          delete d.fx;
          delete d.fy;
        }));

    this.node.append('circle')
      .attr('r', (d: FlowIdea) => d.r)
      .attr('fill', (d: FlowIdea) => d3.color(d.color))
      .attr('stroke', '#fff')
      .attr('stroke-width', '2px')

    this.node.append('text')
      .attr('dy', '.33em')
      .attr('text-anchor', 'middle')
      .style('font', 'normal small-caps 300 16px "Roboto", sans-serif')
      .style('color', 'silver')
      .text((d: FlowIdea) => d.name);
  }
}
