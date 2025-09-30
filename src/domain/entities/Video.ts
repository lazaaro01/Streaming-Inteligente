export class Video {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public url: string,
    public views: number = 0
  ) {}
}
