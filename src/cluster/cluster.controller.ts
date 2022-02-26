import { ServerUnaryCall, Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';


class ConteinerId {
    namespace: string
    pod: string
    container: string

  constructor(
    namespace: string,
    pod: string,
    container: string)
    {
      this.namespace = namespace
      this.pod = pod
      this.container = container
    }
}

class LogLine {
    timestamp: number
    logLine: string

  constructor(
    timestamp: number,
    logLine: string)
    {
      this.timestamp = timestamp
      this.logLine = logLine
    }
}

@Controller('cluster')
export class ClusterController {

  @GrpcMethod('ListenService', 'Listen')
  listen(data: ConteinerId, metadata: Metadata, call: ServerUnaryCall<any, any>): LogLine {
    return {  timestamp: 100, logLine:'yo listen'}
  }

  @GrpcMethod('ListenService', 'Strcture')
  structure(data: ConteinerId, metadata: Metadata, call: ServerUnaryCall<any, any>): LogLine {
    return {  timestamp: 200, logLine:'yo structure'}
  }

}
