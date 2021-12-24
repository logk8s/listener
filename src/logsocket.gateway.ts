//https://medium.com/@mohsenes/websocket-cluster-with-nestjs-and-redis-a18882d418ed
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LogLine } from './utils/log-line';

@WebSocketGateway( { cors: true, transports: ['websocket', 'polling'] })
export class LogsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private logger: Logger = new Logger('AppGateway');

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
    this.logger.log("header auth: " + client.handshake.headers.authorization);
    if (!this.connectedSockets[client.id])
      this.connectedSockets[client.id] = [];
    this.connectedSockets[client.id].push(client);
    this.logger.log(client.id);
    setInterval(function () {
      const ll = new LogLine(
          "line",
          "level",
          "cluster",
          Date.now(),
          "153.168.144.131",
          32001,
          "pod",
          "namespace",
        )
      client.emit('logline', ll.JSONstringify())
      //client.send("Some MESSAGE Event");
    }, 1000);//run this thang every 1 second
}
  handleDisconnect(client: Socket) {
    // this.connectedSockets[client.id] = this.connectedSockets[
    //   client.id
    // ].filter(p => p.id !== client.id);
  }

  @SubscribeMessage('message')
  handleTestMessage(client: Socket, text: string): void {
    client.send("Respond to general message");
  }

  @SubscribeMessage('testline')
  handleTestLineMessage(client: Socket, text: string): WsResponse<LogLine> {
    return {
      event: 'logline',
      data: new LogLine("line",
        "level",
        "cluster",
        new Date().getDate(),
        "ip",
        80,
        "pod",
        "namespace",
      )
    }
  }
}
