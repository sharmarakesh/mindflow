import { Injectable } from '@angular/core';

import * as d3 from 'd3';

import { GraphLink, GraphNode } from './models';

@Injectable()
export class GraphService {
  public setupGraph(width: number | string, height: number | string, container: string): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    return d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  public setupForceLayout(nodes: GraphNode[], links: GraphLink[], container): d3.Simulation<GraphNode, GraphLink> {
    return d3.forceSimulation(nodes).alphaDecay(0.01)
      .force('charge', d3.forceManyBody()
        // .strength(80).distanceMax(400).distanceMin(80)
      )
      .force('link', d3.forceLink(links)
        .distance((l: GraphLink) => l.distance)
        .strength((l: GraphLink) => l.strength)
      )
      // .force('center', d3.forceCenter(container.attr('width') / 2, container.attr('height') / 2))
      // .force('y', d3.forceY(0.001))
      // .force('x', d3.forceX(0.001))
    // .force('attractForce', d3.forceManyBody().strength(80).distanceMax(400).distanceMin(80))
    // .force('collisionForce', d3.forceCollide(12).strength(1).iterations(100));
  }
}
