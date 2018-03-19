import { FlowLink, FlowNode } from '.';

export class Flow {
  constructor(
    public links: FlowLink[],
    public nodes: FlowNode[]
  ) { }
}