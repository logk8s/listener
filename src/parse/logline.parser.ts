import { LogLine } from "src/utils/log-line"



export class LogLineParser{
  static  parse(line: string, namespace: string,
    pod: string,
    container: string): LogLine{
    var ll;
    line = line.trim()
    //use https://regexr.com/
    //match log4js
    var myRegex = new RegExp(/(\[\d\d\D)\[(.*)\]\s+\[(.*)\]\s+(.*)\s+\-\s+(.*\[\d\d\D)(.*)/g)
    const match = myRegex.exec(line)
    if (match != null) {
      const timestamp = new Date(match[2]).getTime()*1000
      const level = match[3]
      const category = match[4]
      const line = match[6]

      ll = new LogLine(
        timestamp,
        level,
        category,
        line,
        "cluster",
        namespace,
        pod,
        container,
      )

    } else {
      const timestamp = new Date().getTime()*1000
      const level = 'N/A'
      const category = 'N/A'
      const raw_line = line

      ll = new LogLine(
        timestamp,
        level,
        category,
        raw_line,
        "cluster",
        namespace,
        pod,
        container,
        )
    }
    return ll
  }

}