import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/utils/token-util';
import { ChatConversation, ChatMessage } from '@/api/system/chat/model';
import {
  pageChatConversation,
  updateChatConversation
} from '@/api/system/chat';
import { emitter } from '@/utils/common';

const SOCKET_URL: string = 'wss://server.gxwebsoft.com';

interface ConnectionOptions {
  token: string;
  userId: number;
  isAdmin: boolean;
}

export interface ChatState {
  socket: Socket | undefined;
  conversations: ChatConversation[];
}

export const useChatStore = defineStore({
  id: 'chat',
  state: (): ChatState => ({
    socket: undefined,
    conversations: []
  }),
  getters: {
    unReadLetter(): number {
      return this.conversations.reduce((count, item) => count + item.unRead, 0);
    },
    unReadConversations(): ChatConversation[] {
      return this.conversations
        .filter((item) => item.unRead > 0)
        .sort((a, b) => {
          return (
            new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
          );
        });
    }
  },
  actions: {
    readConversation(id) {
      const index = this.conversations.findIndex((item) => item.id === id);
      if (index >= 0) {
        updateChatConversation({
          id: this.conversations[index].id,
          unRead: 0
        });
        this.conversations.splice(index, 1);
      }
    },
    async connectSocketIO(userId: number) {
      console.log(
        '---------------------------------connectSocketIO----------------------------------'
      );
      const options: ConnectionOptions = {
        token: getToken() || '',
        userId: userId,
        isAdmin: true
      };

      const socket: Socket = io(SOCKET_URL, {
        query: options,
        transports: ['websocket', 'polling'],
        timeout: 5000
      });

      socket.on('connect', () => {
        this.socket = socket;
        console.log(
          '---------------------------------socket connect----------------------------------'
        );
        // 获取聊天列表
        pageChatConversation({
          keywords: '',
          status: 1,
          page: 1,
          limit: 100,
          onlyFake: true
        }).then((res) => {
          if (res?.list) {
            this.conversations = res.list;
          }
        });
      });
      console.log(
        '---------------------------------socket----------------------------------',
        socket
      );
      console.log('收到socket消息>>>');
      // 收到新消息
      socket.on('message', (data: ChatMessage) => {
        console.log('收到socket消息>>>');
        const index = this.conversations.findIndex(
          (item) =>
            item.friendId === data.formUserId && item.userId === data.toUserId
        );
        let content = '';
        if (data.type == 'image') {
          content = '图片';
        } else if (data.type === 'card') {
          content = '卡片';
        } else {
          content = data.content;
        }
        if (index >= 0) {
          this.conversations[index].unRead++;
          this.conversations[index].content = content;
          this.conversations[index].updateTime = Date.now();
        } else {
          this.conversations.push({
            content: content,
            friendInfo: data.formUserInfo,
            userInfo: data.toUserInfo,
            messages: [],
            unRead: 1,
            updateTime: Date.now(),
            userId: data.toUserId,
            friendId: data.formUserId
          });
        }

        emitter.emit('message', data);
      });

      socket.on('connect_error', () => {
        console.log('connect_error');
      });
    }
  }
});
