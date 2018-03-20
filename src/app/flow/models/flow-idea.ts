export class FlowIdea {
  constructor(
    public id: string | number,
    public x: number,
    public y: number,
    public r: number,
    public color: string,
    public name: string,
    public fx?: number,
    public fy?: number,
    public description?: any
  ) {}
}