
export class Structure {

  constructor(
    private namspaces: Map<String, any>,
    private namspace2pods: Map<String, Map<String, any>>,
    private namspace2podNames: Map<String, Array<String>>,
    private pods: Map<String, any>,
    ) {}

  toJSON(): any {
    return this
  }
}