
export class Stracture {

  constructor(
    private namespaces:any,
    private namespace2pods: any,
    private namespace2podNames: any,
    private pods: any,
    private podContainers: any,
    private tree: any

    ) {}

  toJSON(): any {
    return this
  }
}