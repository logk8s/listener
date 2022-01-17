import { Injectable } from '@nestjs/common'
const k8s = require('@kubernetes/client-node')
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { LogLine } from 'src/utils/log-line';


@Injectable()
export class FetcherService {
  private logger: Logger = new Logger('FetcherService')
  private kc
  private k8sApi

  constructor() {
    this.kc = new k8s.KubeConfig()
    this.kc.loadFromDefault()
    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api)
    //this.fetchStreamTest()
  }
  async fetch() {
    //const logs = await this.k8sApi.readNamespacedPodLog('kafka-0', 'default', undefined, undefined, undefined, undefined, 'true', false, 120000, undefined, true);
    const logs = await this.k8sApi.readNamespacedPodLog('kafka-0', 'default', undefined, undefined, undefined, undefined, 'true', false, undefined, undefined, true);
    this.logger.verbose(logs.body)
  }
  async fetchStream(client: Socket, namespace: string, pod: string, container: string = undefined) {
    const k8sApi = this.k8sApi
    setInterval(async function () {
      try {
        //'emitter', 'emitters'
        //'kafka-0', 'default'
        const res = await k8sApi.readNamespacedPodLog(pod, namespace, container, false, false, undefined, "true", false, 1, undefined, false); //false, false, undefined, "true", false, 1, undefined, false)
        if (res.body)
          res.body.split("\r\n").forEach(line => {
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

              const ll = new LogLine(
                timestamp,
                level,
                category,
                line,
                "cluster",
                namespace,
                pod,
                container,
                )
              client.emit('logline', ll.JSONstringify())
            } else {
              const timestamp = new Date().getTime()*1000
              const level = 'N/A'
              const category = 'N/A'
              const raw_line = line

              const ll = new LogLine(
                timestamp,
                level,
                category,
                raw_line,
                "cluster",
                namespace,
                pod,
                container,
                )
              client.emit('logline', ll.JSONstringify())
            }
          })
      } catch (e) {
        console.log(e.message)
      }
    }, 1000);//run this thang every 1 second
  }
  async fetchStreamTest() {
    const k8sApi = this.k8sApi
    setInterval(async function () {
      try {
        const res = await k8sApi.readNamespacedPodLog('kafka-0', 'default', 'kafka', true, false, undefined, "true", false, 1, undefined, false)
        if (res.body)
          res.body.split("\r\n").forEach(line => {
            line = line.trim()
            var myRegex = new RegExp(/(\[\d\d\D)\[(.*)\]\s+\[(.*)\]\s+(.*)\s+\-\s+(.*\[\d\d\D)(.*)/g)
            const match = myRegex.exec(line)
              if(match != null){
                var JSONLine ={
                  'time': match[2],
                  'level': match[3],
                  'category': match[4],
                  'line': match[6]
                }
              console.log(JSON.stringify(JSONLine))
              } else {
                var JLine ={
                  'time': new Date().getTime()*1000,
                  'level': 'N/A',
                  'category': 'N/A',
                  'line': line
                }
              console.log(JSON.stringify(JLine))

            }
          })
      } catch (e) {
        console.log(e.message)
      }
    }, 1000);
  }
}