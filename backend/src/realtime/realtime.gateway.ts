import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { RealtimeService } from './realtime.service';
import { UpdateRealtimeDto } from './dto/update-realtime.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RealtimeGateway {
  constructor(private readonly realtimeService: RealtimeService) {}

  @SubscribeMessage('updateRealtime')
  update(@MessageBody() updateRealtimeDto: UpdateRealtimeDto, @ConnectedSocket() client: Socket) {
    return this.realtimeService.update(updateRealtimeDto.group_id, client);
  }
}
