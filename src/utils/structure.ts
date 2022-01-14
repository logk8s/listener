
export class Structure {

  constructor(
    private namespaces:any,
    private namespace2pods: any,
    private namespace2podNames: any,
    private pods: any,
    ) {}

  toJSON(): any {
    return this
  }
}