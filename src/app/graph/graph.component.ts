import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { GraphLink, GraphNode } from './models';

const NODES: GraphNode[] = [
  new GraphNode('First', 225, 100)
];

@Component({
  selector: 'graph',
  styleUrls: ['./graph.component.css'],
  templateUrl: './graph.component.html',
})
export class GraphComponent implements OnInit {
  private svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  ngOnInit(): void {
    const flowChart: d3.Selection<d3.BaseType, {}, HTMLElement, any> = d3.select('.flowChart');
    this.svg = flowChart.append('svg')
      .attr('width', flowChart.attr('width'))
      .attr('height', flowChart.attr('height'));

    const simulation: d3.Simulation<GraphNode, GraphLink> = d3.forceSimulation(NODES);
  }
}
