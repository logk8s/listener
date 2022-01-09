
export class LogLine {

  private openSegment =  ' [';
  private closeSegment =  '] ';
  private semicolon =  ': ';
  private semicolonNs =  ':';
  private space =  '  ';
  private direct =  '->';
  private dash = ' - ';

  constructor(
    private timestamp: number,
    private level: string,
    private category: string,
    private line: string,
    private cluster: string = "",
    private namespace: string = "",
    private pod: string = "",
    private container: string = "",
    private ip: string = "",
    private port: number = 0
    //final List<String> lines;
  ) { }

  toString(): string {
    return `
          ${this.timestamp}
          ${this.semicolon}
          ${this.level}
          ${this.space}
          ${this.category}
          ${this.space}
          ${this.cluster}
          ${this.direct}
          ${this.namespace}
          ${this.direct}
          ${this.pod}
          ${this.direct}
          ${this.container}
          ${this.space}
          ${this.openSegment}
          ${this.ip}
          ${this.semicolonNs}
          ${this.port}
          ${this.closeSegment}
          ${this.dash}
          ${this.line}`

  }
  toJSON(): any {
    return {
      line: this.line,
      level: this.level,
      cluster: this.cluster,
      timestamp: this.timestamp,
      ip: this.ip,
      port: this.port,
      pod: this.pod,
      namespace: this.namespace,
      category: this.category,
      container: this.container
    }
  }
  JSONstringify(): any {
    const ret = {
      line: this.line,
      level: this.level,
      cluster: this.cluster,
      timestamp: this.timestamp,
      ip: this.ip,
      port: this.port,
      pod: this.pod,
      namespace: this.namespace,
      category: this.category,
      container: this.container
    }
    return JSON.stringify(ret);
  }
}