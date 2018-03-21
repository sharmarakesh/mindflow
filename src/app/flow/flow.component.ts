import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenu, MatMenuTrigger } from '@angular/material'

import { Subscription } from 'rxjs/Subscription';

import { FirebaseError } from 'firebase/app';

import * as d3 from 'd3';

import { Flow, FlowConnection, FlowIdea } from './models';
import { FlowService } from './flow.service';
import { NotificationService } from '../core/notification.service';
import { IdeaEditDialogComponent } from './idea-edit-dialog/idea-edit-dialog.component';
import { FlowEditDialogComponent } from './flow-edit-dialog/flow-edit-dialog.component';

@Component({
  selector: 'flow',
  styleUrls: ['./flow.component.css'],
  templateUrl: './flow.component.html',
})
export class FlowComponent implements AfterViewInit {
  public flow: Flow;
  public flows: Flow[] = [];
  public mobileQuery: MediaQueryList;
  public selectedIdea: FlowIdea;
  public sideNavFixed: boolean;
  public sideNavMode: string;
  public sideNavOpen: boolean;
  private contextMenuBtn: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  private flowSubscription: Subscription;
  private link: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  private mobileQueryListener: () => void;
  private node: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  private selectedFlowIdx: number = 0;
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
    const container = d3.select('.flowChart');
    const width = container.style('width');
    const height = container.style('height');
    const newFlow: Flow = new Flow([new FlowConnection(0, 0, 0, 0)], [new FlowIdea(+width.slice(0, width.indexOf('px')) / 2, +height.slice(0, height.indexOf('px')) / 2, 30, '#FFB300', '')], '');
    const flowEditDialog: MatDialogRef<FlowEditDialogComponent> = this.dialog.open(FlowEditDialogComponent, {
      data: {
        flow: newFlow
      }
    });

    flowEditDialog.afterClosed().toPromise().then((flow: Flow) => {
      if (!!flow) {
        flow.ideas[0].name = flow.name;
        this.flowSvc.saveFlow(flow);
      }
    })
  }

  public addIdea(context?: boolean): void {
    let newFlowIdea: FlowIdea;
    if (!context) {
      const container = d3.select('.flowChart');
      const width = container.style('width');
      const height = container.style('height');
      newFlowIdea = new FlowIdea(+width.slice(0, width.indexOf('px')) / 2, +height.slice(0, height.indexOf('px')) / 2, 50, '#ffd740', '');
    } else {
      const x = this.contextMenuBtn.style('left');
      const y = this.contextMenuBtn.style('top');
      newFlowIdea = new FlowIdea(+x.slice(0, x.indexOf('px')), +y.slice(0, y.indexOf('px')), 50, '#ffd740', '');
    }
    const ideaEditDialog: MatDialogRef<IdeaEditDialogComponent> = this.dialog.open(IdeaEditDialogComponent, {
      data: {
        connections: [],
        idea: newFlowIdea,
        ideas: this.flow.ideas
      },
      minWidth: '400px'
    });

    ideaEditDialog.afterClosed().toPromise().then((data: { idea: FlowIdea, connections: FlowConnection[] }) => {
      if (data) {
        this.flow.ideas.push(data.idea);
        this.flow.connections.push(...data.connections);
        this.flowSvc.saveFlow(this.flow);
      }
    })
  }

  public editIdea(): void {
    const ideaEditDialog: MatDialogRef<IdeaEditDialogComponent> = this.dialog.open(IdeaEditDialogComponent, {
      data: {
        connections: this.flow.connections.filter((c: FlowConnection) => {
          if ((<FlowIdea>c.source).index === this.selectedIdea.index || (<FlowIdea>c.target).index === this.selectedIdea.index) {
            return c;
          }
        }),
        idea: this.selectedIdea,
        ideas: this.flow.ideas
      },
      minWidth: '400px'
    });

    ideaEditDialog.afterClosed().toPromise().then((data: { idea: FlowIdea, connections: FlowConnection[] }) => {
      if (data) {
        this.flow.ideas[data.idea.index] = Object.assign({}, data.idea);
        data.connections.forEach((c: FlowConnection) => {
          this.flow.connections[c['index']] = Object.assign({}, c);
        });
        this.flowSvc.saveFlow(this.flow);
      }
      this.selectedIdea = undefined;
    })
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
    if (flow === this.flow) {
      this.flow = new Flow([], [], '');
    }
    this.flowSvc.removeFlow(flow);
  }

  public removeIdea(): void {
    const flow: Flow = Object.assign({}, this.flow, { '$key': this.flow['$key'] });
    flow.ideas.splice(this.selectedIdea.index, 1);
    flow.connections = [...flow.connections.filter((c: FlowConnection) => {
      if ((<FlowIdea>c.source).index !== this.selectedIdea.index && (<FlowIdea>c.target).index !== this.selectedIdea.index) {
        return c;
      }
    })];
    this.selectedIdea = undefined;
    this.flowSvc.saveFlow(this.flow);
  }

  public selectFlow(i: number): void {
    this.selectedFlowIdx = i;
    this.flow = Object.assign({}, this.flows[i], { '$key': this.flows[i]['$key'] });
    this.redraw();
  }

  ngAfterViewInit(): void {
    this.contextMenuBtn = d3.select('#contextMenuBtn');
    setTimeout(() => this.setupFlow(), 10);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.flowSubscription.unsubscribe();
    this.flowSvc.saveFlow(this.flow);
  }

  private redraw(): void {
    if (!!this.flow.connections.length && !!this.flow.ideas.length) {
      this.setupSVG();
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

  private setSideNav(): void {
    this.sideNavFixed = this.mobileQuery.matches;
    this.sideNavMode = this.mobileQuery.matches ? 'over' : 'side';
    this.sideNavOpen = !this.mobileQuery.matches;
  }

  private setupFlow(): void {
    this.notifySvc.showLoading();
    if (this.flowSubscription) {
      this.flowSubscription.unsubscribe();
    }
    this.flowSubscription = this.flowSvc.getFlows().subscribe((flows: Flow[]) => {
      if (!!flows && flows['$value'] !== null) {
        this.notifySvc.closeLoading();
        this.flows = [...flows];
        if (this.flows.length) {
          this.selectedFlowIdx = this.selectedFlowIdx >= this.flows.length ? this.flows.length - 1 : this.selectedFlowIdx;
          this.flow = Object.assign({}, this.flows[this.selectedFlowIdx], { '$key': this.flows[this.selectedFlowIdx]['$key'] }) || new Flow([], [], '');
          this.redraw();
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
      .force('link', d3.forceLink(this.flow.connections).id((d: FlowIdea) => d.index)
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
          this.flowSvc.saveFlow(this.flow);
        })
      )
      .on('contextmenu', (d: FlowIdea) => {
        this.selectedIdea = Object.assign({}, d);
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.contextMenuBtn.style('display', '');
        this.contextMenuBtn.style('left', `${d3.event.clientX - 256}px`);
        this.contextMenuBtn.style('top', `${d3.event.clientY - 64}px`);
        this.menuTrigger.toggleMenu();
      })

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

  private setupSVG(): void {
    if (this.svg) {
      this.svg.remove();
      d3.select('.flowChart').selectAll('svg').remove();
    }
    this.svg = d3.select('.flowChart')
      .append('svg:svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr("pointer-events", "all")
      .append('svg:g')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(d3.zoom()
        .on('zoom', () => {
          this.svg.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k})`);
        })
      )
      .on('contextmenu', () => {
        d3.event.preventDefault();
        this.contextMenuBtn.style('display', '');
        this.contextMenuBtn.style('left', `${d3.event.clientX - 256}px`);
        this.contextMenuBtn.style('top', `${d3.event.clientY - 64}px`);
        this.menuTrigger.toggleMenu();
      })
      .append('svg:g');

    const rect = this.svg
      .append('svg:rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', 'none');
  }
}
