import { FlowConnection, FlowIdea } from '.';

export class Flow {
  constructor(
    public connections: FlowConnection[],
    public ideas: FlowIdea[],
    public name: string
  ) { }
}