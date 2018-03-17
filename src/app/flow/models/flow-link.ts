import { FlowNode } from './flow-node';

export class FlowLink {
  constructor(
    public source: string | number | FlowNode,
    public target: string | number | FlowNode,
    public distance: number,
    public strength: number
  ) {}
}