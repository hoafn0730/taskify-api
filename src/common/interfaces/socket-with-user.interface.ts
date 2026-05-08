import { Socket } from 'socket.io';
import { User } from '../../entities/user.entity';

export interface SocketWithUser extends Socket {
    user: User;
}
