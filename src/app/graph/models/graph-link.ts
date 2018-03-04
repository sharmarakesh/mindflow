export class GraphLink {
  constructor(
    public source: string | number,
    public target: string | number,
    public distance: number,
    public strength: number
  ) {}
}