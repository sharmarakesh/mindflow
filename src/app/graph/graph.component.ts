import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { GraphLink, GraphNode } from './models';
import { GraphService } from './graph.service';
import { DragBehavior } from 'd3';

const LINKS: GraphLink[] = [
  new GraphLink(0, 1, 50, 0.1)
];

const NODES: GraphNode[] = [
  new GraphNode(0, 225, 100, 15, '#FFB300', 'Bob'),
  new GraphNode(1, 400, 300, 30, '#FFB300', 'Jerry'),
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
    this.svg = this.graphSvc.setupGraph('100%', '100%', '.flowChart');
    this.simulation = this.graphSvc.setupForceLayout(NODES, LINKS, this.svg);
    this.node = this.svg.selectAll('circle')
      .data(NODES)
      .enter().append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => d3.color(d.color))
      // .classed('node', true)
      .call(d3.drag()
        .on('start', (d: GraphNode) => {
          this.simulation.restart();
          this.simulation.alpha(0.7);
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d: GraphNode) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d: GraphNode) => {
          d.fx = null;
          d.fy = null;
          this.simulation.alphaTarget(0.1);
        }));

    // this.node.append("text")
    //   .attr("dx", -18)
    //   .attr("dy", 8)
    //   .style("font-family", "overwatch")
    //   .style("font-size", "18px")
    //   .text(d => {
    //     return d.name
    //   });

    // this.link = this.svg.selectAll('.link')
    //   .data(LINKS)
    //   .enter().append('line')
    //   .classed('link', true)


    this.simulation.on("tick", () => {
      // this.link.attr("x1", d => {
      //   return d.source.x;
      // })
      //   .attr("y1", d => {
      //     return d.source.y;
      //   })
      //   .attr("x2", d => {
      //     return d.target.x;
      //   })
      //   .attr("y2", d => {
      //     return d.target.y;
      //   });
      this.node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
    });
  }
}
