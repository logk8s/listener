
export class LogLine {

  private openSegment =  ' [';
  private closeSegment =  '] ';
  private semicolon =  ': ';
  private semicolonNs =  ':';
  private space =  '  ';
  private direct =  '->';
  private dash = ' - ';

  constructor(
    private line: string,
    private level: string,
    private cluster: string,
    private timestamp: number,
    private ip: string,
    private port: number,
    private pod: string,
    private namespace: string,
    //final List<String> viewers;
  ) { }

  toString(): string {
    return `
          ${this.timestamp}
          ${this.semicolon}
          ${this.level}
          ${this.space}
          ${this.cluster}
          ${this.direct}
          ${this.namespace}
          ${this.direct}
          ${this.pod}
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
    }
    return JSON.stringify(ret);
  }
}