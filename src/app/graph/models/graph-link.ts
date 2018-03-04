import { GraphNode } from './graph-node';

export class GraphLink {
  constructor(
    public source: string | number | GraphNode,
    public target: string | number | GraphNode,
    public distance: number,
    public strength: number
  ) {}
}