import { FlowIdea } from './flow-idea';

export class FlowConnection {
  constructor(
    public source: string | number | FlowIdea,
    public target: string | number | FlowIdea,
    public distance: number,
    public strength: number
  ) {}
}