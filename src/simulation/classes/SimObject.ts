export class SimObject {
  constructor(private id?: string) {
    if (!id) this.id = 'asd'
  }
}
