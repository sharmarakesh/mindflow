import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { GraphLink, GraphNode } from './models';
import { GraphService } from './graph.service';
import { DragBehavior } from 'd3';

const LINKS: GraphLink[] = [
  new GraphLink(0, 1, 50, 0.1),
  new GraphLink(0, 2, 50, 1),
  new GraphLink(1, 3, 100, 2)
];

const NODES: GraphNode[] = [
  new GraphNode(0, 225, 100, 30, '#FFB300', 'Bob'),
  new GraphNode(1, 400, 300, 30, '#FFB300', 'Jerry'),
  new GraphNode(2, 500, 500, 30, '#ffff00', 'John'),
  new GraphNode(3, 800, 100, 30, '#00ff00', 'George')
];

@Component({
  selector: 'graph',
  styleUrls: ['./graph.component.css'],
  templateUrl: './graph.component.html',
})
export class GraphComponent implements OnInit {
  private link: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  private node: d3.Selection<d3.BaseType, d3.Group, d3.BaseType, any>;
  private simulation: d3.Simulation<GraphNode, GraphLink>;
  private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  constructor(private graphSvc: GraphService) { }

  ngOnInit(): void {

    this.svg = d3.select('.flowChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('width', '100%')
      .attr('height', '100%')
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

    this.setupForceLayout();
    this.setupLinks();
    this.setupNodes();

    this.simulation.on('tick', () => {
      this.link.attr('x1', (d: GraphLink) => (<GraphNode>d.source).x)
        .attr('y1', (d: GraphLink) => (<GraphNode>d.source).y)
        .attr('x2', (d: GraphLink) => (<GraphNode>d.target).x)
        .attr('y2', (d: GraphLink) => (<GraphNode>d.target).y);

      this.node.attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
    });
  }

  private setupForceLayout(): void {
    this.simulation = d3.forceSimulation(NODES).alphaDecay(0.01)
      .velocityDecay(0.55)
      .force('link', d3.forceLink(LINKS)
        .distance((l: GraphLink) => l.distance)
        .strength((l: GraphLink) => l.strength)
      )
      .force('charge', d3.forceManyBody().strength(-100).distanceMin(10000))
      .force('collide', d3.forceCollide(45).strength(1));
  }

  private setupLinks(): void {
    this.link = this.svg.selectAll('line')
      .data(LINKS)
      .enter().append('line')
      .attr('stroke', 'rgba(255, 255, 255, .5)')
      .attr('stroke-width', '1px');
  }

  private setupNodes(): void {
    this.node = this.svg.selectAll('.node')
      .data(NODES)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (d: GraphNode) => {
          if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d: GraphNode) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d: GraphNode) => {
          if (!d3.event.active) {
            this.simulation.alphaTarget(0);
          }
          delete d.fx;
          delete d.fy;
        }));

    this.node.append('circle')
      .attr('r', (d: GraphNode) => d.r)
      .attr('fill', (d: GraphNode) => d3.color(d.color))
      .attr('stroke', '#fff')
      .attr('stroke-width', '2px')

    this.node.append('text')
      .attr('dy', '.33em')
      .attr('text-anchor', 'middle')
      .style('font', 'normal small-caps 300 16px "Roboto", sans-serif')
      .style('color', 'silver')
      .text((d: GraphNode) => d.name);
  }
}
