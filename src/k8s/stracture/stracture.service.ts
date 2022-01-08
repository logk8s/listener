import { Injectable } from '@nestjs/common';
const k8s = require('@kubernetes/client-node')
import { Logger } from '@nestjs/common';
import { Structure } from 'src/utils/structure';


@Injectable()
export class StractureService {
  private logger: Logger = new Logger('StractureService')
  private namspaces = new Map<String, any>()
  private namspace2pods = new Map<String, Map<String, any>>()
  private namspace2podNames = new Map<String, Array<String>>()
  private podContainers = new Map<String, Array<String>>()
  private pods = new Map<String, any>()
  private kc
  private k8sApi
  private structure

  constructor() {
    this.structure =  new Structure(this.namspaces, this.namspace2pods, this.namspace2podNames, this.pods)
    this.kc = new k8s.KubeConfig()
    this.kc.loadFromDefault()
    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api)
    this.getNamespaces()
  }

  async getNamespaces() {
    const ns_res = await this.k8sApi.listNamespace()
    const ns_items = ns_res.body.items
    this.mapNamespaces(ns_items);
    const pod_ret = await this.k8sApi.listPodForAllNamespaces()
    const pod_items = pod_ret.body.items
    this.mapPods(pod_items);
    //this.logger.verbose(JSON.stringify(pod_ret.body.items))//, null, 2))
  }
  mapPods(pod_items: any) {
    pod_items.forEach(pod => {
      this.pods.set(pod.metadata.name, pod)
      this.namspace2pods
        .get(pod.metadata.namespace)
        .set(pod.metadata.name, pod)
      this.namspace2pods
        .get(pod.metadata.namespace)
        .set(pod.metadata.name, pod)
      this.namspace2podNames
        .get(pod.metadata.namespace)
        .push(pod.metadata.name)
      let containers = Array<String>()
      pod.spec.containers.forEach(container => {
        console.log(`${pod.metadata.name}: ${container.name}`)
        containers.push(container.name)
      })
      this.podContainers.set(pod.metadata.name, containers)

    });
  }
  mapNamespaces(ns_items: any) {
    ns_items.forEach(namespace => {
      const name = namespace.metadata.name
      this.namspaces.set(name, namespace)
      this.namspace2pods.set(name, new Map<String, any>())
      this.namspace2podNames.set(name, new Array<String>())
    });
  }

  get getNamspaces(): Map<String, any> {
    return this.namspaces
  }

  get getNamspace2podNames(): Map<String, Array<String>> {
    return this.getNamspace2podNames
  }

  get getStructure(): Structure {
    return this.structure
  }
}


