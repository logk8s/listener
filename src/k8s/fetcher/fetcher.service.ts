import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
const k8s = require('@kubernetes/client-node')
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { LogLineParser } from 'src/parse/logline.parser';
import { LogLine } from 'src/utils/log-line';


class FetchID {
  key: string

  constructor(
    private namespace: string,
    private pod: string,
    private container: string
  ) {
    this.key = this.namespace + this.pod + this.container;
  }
}

class StreamFetcher {
  private interval;
  private featching = false;

  constructor(
    private k8sApi,
    private clientId: string,
    private client: Socket,
    private namespace: string,
    private pod: string,
    private container: string = undefined)
  {}

  private fetchStream() {
    if (this.featching)
      throw new Error('Already fetching')
    this.featching = true
    const k8sApi = this.k8sApi
    const namespace = this.namespace
    const pod = this.pod
    const container = this.container
    const client = this.client
    this.interval = setInterval(async function () {
      try {
        //'emitter', 'emitters'
        //'kafka-0', 'default'
        const res = await k8sApi.readNamespacedPodLog(pod, namespace, container, false, false, undefined, "true", false, 1, undefined, false); //false, false, undefined, "true", false, 1, undefined, false)
        if (res.body)
          res.body.split("\r\n").forEach(line => {
            const ll = LogLineParser.parse(line, namespace, pod, container)
            client.emit('logline', ll.JSONstringify())
          })
      } catch (e) {
        console.log(e.message)
      }
    }, 1000);//run this thang every 1 second
  }

  stopStream() {
    clearInterval(this.interval)
    this.featching = false
  }

  startStream() {
    if (!this.featching)
      this.fetchStream()
  }

  isFeching(): boolean { return this.featching }

}

@Injectable()
export class FetcherService {
  private logger: Logger = new Logger('FetcherService')
  private kc
  private k8sApi
  private  clientFetures: Map<String, Map<String, StreamFetcher>> = new Map<String, Map<String, StreamFetcher>>()

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

  async addClientFetcher(clientId: string, client: Socket, start: boolean, namespace: string, pod: string, container: string = undefined) {
    const key = new FetchID(namespace, pod, container).key
    var sf = new StreamFetcher(this.k8sApi, clientId, client, namespace, pod, container)
    if (!this.clientFetures.has(clientId))
      this.clientFetures.set(clientId, new Map<String, StreamFetcher>())
    if (this.clientFetures.get(clientId).has(key))
      throw new Error('client already listen for those parameters')
    this.clientFetures.get(clientId).set(key, sf)
    if(start) sf.startStream()
  }

  removeClientFetcher(clientId: string) {
    if (!this.clientFetures.has(clientId))
      return
    this.stopAllClientFetcher(clientId)
    this.clientFetures.delete(clientId)
  }

  startClientFetcher(clientId: string, namespace: string, pod: string, container: string = undefined) {
    const key = new FetchID(namespace, pod, container).key
    this.clientFetures.get(clientId).get(key).startStream()
  }

  existsClientFetcher(clientId: string, namespace: string, pod: string, container: string = undefined) {
    const key = new FetchID(namespace, pod, container).key
    const ret = this.clientFetures.has(clientId) && this.clientFetures.get(clientId).has(key)
    this.logger.debug(`ret=${ret}`)
    return ret;
  }

  stopClientFetcher(clientId: string, namespace: string, pod: string, container: string = undefined) {
    const key = new FetchID(namespace, pod, container).key
    const client = this.clientFetures.get(clientId)
    const sf = client.get(key)
    sf.stopStream()
  }

  startAllClientFetcher(clientId: string) {
    for (let fetcher of this.clientFetures.get(clientId).values())
      fetcher.startStream()
  }

  stopAllClientFetcher(clientId: string) {
    for (let fetcher of this.clientFetures.get(clientId).values())
      fetcher.stopStream()
  }

  fetchStream(client: Socket, namespace: string, pod: string, container: string = undefined) {
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