//https://medium.com/@mohsenes/websocket-cluster-with-nestjs-and-redis-a18882d418ed
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { FetcherService } from './k8s/fetcher/fetcher.service';
import { StractureService } from './k8s/stracture/stracture.service';
import { UsageService } from './usage/usage.service';
import { LogLine } from './utils/log-line';
import { Stracture } from './utils/stracture';

const msg =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

@WebSocketGateway( { cors: true, transports: ['websocket', 'polling'] })
export class LogsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private logger: Logger = new Logger('AppGateway');

  constructor(private stractureService: StractureService,
    private fetcher: FetcherService,
    private usage: UsageService) {

  }

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }
  public connectedSockets: { [key: string]: any[] } = {};

  private extractTokensCookie(cookie: string) {
    const parts: String[] = cookie.split(';');
    const trimmed = parts.map(p => p.trim());
    const tokenParts = trimmed.find(p => p.split('=')[0] === 'token')
    return tokenParts.split('=')[1]
  }

  handleConnection(client: Socket, req: Request, ...args: any[]) {
    //const token = this.extractTokensCookie(req.headers['cookie'])
    // for this example, we simply set userId by token
    //client.id = token;
    this.logger.log("header auth: " + client.handshake.headers.authorization)
    if (!this.connectedSockets[client.id])
      this.connectedSockets[client.id] = []
    this.connectedSockets[client.id].push(client)
    this.logger.log(client.id)
    client.emit('connected', client.id)
    //this.fetcher.fetchStream(client, 'emitters', 'emitter', 'emitter')

    // setInterval(function () {
    //   const ll = new LogLine(
    //     Date.now()*1000,
    //     "Debug",
    //     "category",
    //     msg,
    //     "cluster",
    //     "namespace",
    //     "pod",
    //     "container"
    //     )
    //   client.emit('logline', ll.JSONstringify())
    //   //client.send("Some MESSAGE Event");
    // }, 1000);//run this thang every 1 second
}
  handleDisconnect(client: Socket) {
    // this.connectedSockets[client.id] = this.connectedSockets[
    //   client.id
    // ].filter(p => p.id !== client.id);
  }

  @SubscribeMessage('message')
  handleTestMessage(client: Socket, text: string): void {
    console.log("handleTestMessage: " + text)
    client.send("Respond to general message");
    this.usage.create({name: 'moshe', dueDate: 1})
  }

  @SubscribeMessage('stracture')
  stractureMessage(client: Socket, json: string): WsResponse<Stracture> {
    const message = JSON.parse(json)
    if (message.subject == 'listen') {
      console.log('listen command - ' + message.listener.namespace)
      const l = message.listener
      //this.fetcher.fetchStream(client, l.namespace, l.pod, l.container)
      if (this.fetcher.existsClientFetcher(client.id, l.namespace, l.pod, l.container))
        this.fetcher.startClientFetcher(client.id, l.namespace, l.pod, l.container)
      else
        this.fetcher.addClientFetcher(client.id, client, true,  l.namespace, l.pod, l.container)
    }
    else if (message.subject == 'start') {
      console.log('start command - ' + message.listener.namespace)
      const l = message.listener
      this.fetcher.startClientFetcher(client.id, l.namespace, l.pod, l.container)
    }
    else if (message.subject == 'stop') {
      console.log('stop command - ' + message.listener.namespace)
      const l = message.listener
      this.fetcher.stopClientFetcher(client.id, l.namespace, l.pod, l.container)
    }
    else if (message.subject == 'start_all') {
      console.log('start_all command - ' + message.listener.namespace)
      const l = message.listener
      this.fetcher.startAllClientFetcher(client.id)
    }
    else if (message.subject == 'stop_all') {
      console.log('stop_all command - ' + message.listener.namespace)
      const l = message.listener
      this.fetcher.stopAllClientFetcher(client.id)
    }
    else if (message.subject == 'stracture') {
      const stracture = this.stractureService.getStracture
      //console.log(JSON.stringify(stracture))
      return {
        event: 'stracture',
        data: stracture
      }
    }
  }

  @SubscribeMessage('testline')
  handleTestLineMessage(client: Socket, text: string): WsResponse<LogLine> {
    return {
      event: 'logline',
      data: new LogLine(
        Date.now()*1000,
        "Debug",
        "category",
        msg,
        "cluster",
        "namespace",
        "pod",
        "container"
      )
    }
  }
}
