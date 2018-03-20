import { FlowConnection, FlowIdea } from '.';

export class Flow {
  constructor(
    public links: FlowConnection[],
    public name: string,
    public nodes: FlowIdea[]
  ) { }
}