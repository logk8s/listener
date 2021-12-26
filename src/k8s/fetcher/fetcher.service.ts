import { Injectable } from '@nestjs/common'
const k8s = require('@kubernetes/client-node')
import { Logger } from '@nestjs/common';
import { map } from 'rxjs';


@Injectable()
export class FetcherService {
  private logger: Logger = new Logger('StractureService')

}