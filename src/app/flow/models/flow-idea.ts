export class FlowIdea {
  constructor(
    public x: number,
    public y: number,
    public r: number,
    public color: string,
    public name: string,
    public index?: number,
    public description?: any,
    public fx?: number,
    public fy?: number,
    public vx?: number,
    public vy?: number
  ) {}
}