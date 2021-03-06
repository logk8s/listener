import { Injectable } from '@nestjs/common';
const k8s = require('@kubernetes/client-node')
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stracture } from 'src/utils/stracture';


@Injectable()
export class StractureService {
  private logger: Logger = new Logger('StractureService')
  private namespaces = {}
  private namespace2pods = {}
  private namespace2podNames = {}
  private podContainers = {}
  private pods = {}
  private tree = {}
  private kc
  private k8sApi
  private stracture

  constructor(private configService: ConfigService) {
    try {
      this.kc = new k8s.KubeConfig()
      if(this.configService.get<boolean>('loadFromDefault', false))
        this.kc.loadFromDefault()
      else
        this.kc.loadFromCluster()
      this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api)
      this.getNamespaces()
      this.stracture = new Stracture(this.namespaces, this.namespace2pods, this.namespace2podNames, this.pods, this.podContainers, this.tree)
    } catch (e) {
      console.log(e)
    }
  }

  async getNamespaces() {
    const ns_res = await this.k8sApi.listNamespace()
    const ns_items = ns_res.body.items
    this.mapNamespaces(ns_items);
    const pod_ret = await this.k8sApi.listPodForAllNamespaces()
    const pod_items = pod_ret.body.items
    this.mapPods(pod_items);
  }

  mapPods(pod_items: any) {
    pod_items.forEach(pod => {
      this.pods[pod.metadata.name] = pod
      this.namespace2pods[pod.metadata.namespace][pod.metadata.name] = pod
      //this.namespace2pods[pod.metadata.namespace][pod.metadata.name] = pod
      if (!this.namespace2podNames[pod.metadata.namespace])
        this.namespace2podNames[pod.metadata.namespace] = []

      this.namespace2podNames[pod.metadata.namespace].push(pod.metadata.name)
      let containers = []
      pod.spec.containers.forEach(container => {
        //console.log(`${pod.metadata.name}: ${container.name}`)
        containers.push(container.name)
      })

      if (!this.tree[pod.metadata.namespace])
        this.tree[pod.metadata.namespace] = {}

      if (!this.tree[pod.metadata.namespace][pod.metadata.name])
        this.tree[pod.metadata.namespace][pod.metadata.name] = []
      this.tree[pod.metadata.namespace][pod.metadata.name].push(containers)

      this.podContainers[pod.metadata.name] = containers

    });
  }
  mapNamespaces(ns_items: any) {
    ns_items.forEach(namespace => {
      const name = namespace.metadata.name
      this.namespaces[name] = namespace
      this.namespace2pods[name] = {}
      this.namespace2podNames[name] =  []
    });
  }

  get getnamespaces(): any {
    return this.namespaces
  }

  get getnamespace2podNames(): Map<String, Array<String>> {
    return this.getnamespace2podNames
  }

  get getStracture(): Stracture {
    return this.stracture
  }
}


