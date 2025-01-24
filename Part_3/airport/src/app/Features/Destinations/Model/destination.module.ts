export class Destination {
  constructor(
    public code: string,
    public name: string,
    public airportName: string,
    public airportUrl: string,
    public imageUrl: string
  ) {
  }

  toPlainObject() {
    return {
      code: this.code,
      name: this.name,
      airportName: this.airportName,
      airportUrl: this.airportUrl,
      imageUrl: this.imageUrl,
    };
  }
}
