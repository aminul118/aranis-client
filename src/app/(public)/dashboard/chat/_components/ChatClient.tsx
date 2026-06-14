'use client';

export const dynamic = 'force-dynamic';

import { logger } from '@/lib/logger';
import {
  getMessages,
  getOrCreateConversation,
  markAsSeen,
} from '@/services/chat/chat';
import { getMe } from '@/services/user/users';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatEmptyState from './ChatEmptyState';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import ChatMessage from './ChatMessage';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

export default function ChatClient() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // 1. Initial Data Fetch (User and Conversation)
  useEffect(() => {
    const init = async () => {
      const res = await getMe();
      if (res?.success) {
        setUser(res.data);
        const convRes = await getOrCreateConversation([res.data._id]);
        if (convRes?.success) {
          setConversation(convRes.data);
          // Initial fetch of messages
          setLoading(true);
          const msgRes = await getMessages(convRes.data._id);
          if (msgRes?.success) {
            setMessages(msgRes.data || []);
          }
          setLoading(false);
          // mark as seen in DB and notify via socket
          markAsSeen(convRes.data._id);
          socketRef.current?.emit('message-seen', {
            conversationId: convRes.data._id,
            userId: res.data._id,
          });
        } else {
          logger.error('Failed to get conversation:', convRes);
        }
      }
    };
    init();
  }, []);

  // 2. Socket Initialization and Room Joining
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    const handleConnect = () => {
      socket.emit('join-user-room', user._id);
      if (conversation?._id) {
        socket.emit('join-room', conversation._id);
        socket.emit('set-active-chat', {
          userId: user._id,
          conversationId: conversation._id,
        });
      }
    };

    if (socket.connected) {
      handleConnect();
    }
    socket.on('connect', handleConnect);

    socket.on('receive-message', (data) => {
      if (conversation?._id === data.conversationId) {
        setMessages((prev) => {
          // Prevent duplicates if optimistic update already added it
          if (
            prev.find(
              (m) =>
                (m._id && m._id === data._id) ||
                (m.tempId && m.tempId === data.tempId),
            )
          )
            return prev;
          return [...prev, data];
        });
        socket.emit('message-seen', {
          conversationId: conversation._id,
          userId: user._id,
        });
      }
    });

    socket.on('messages-marked-seen', (data) => {
      if (conversation?._id === data.conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === data.userId || msg.sender?._id === data.userId
              ? msg
              : { ...msg, status: 'seen' },
          ),
        );
      }
    });

    return () => {
      socket.emit('set-active-chat', {
        userId: user._id,
        conversationId: null,
      });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, conversation?._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !conversation || !user) return;

    const receiverId =
      conversation.participants.find(
        (p: any) => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN',
      )?._id ||
      conversation.participants.find((p: any) => p._id !== user._id)?._id ||
      conversation.participants[0]?._id;

    const newMessage: any = {
      tempId: `temp-${Date.now()}`,
      sender: user._id,
      senderRole: user.role,
      receiver: receiverId,
      text: message,
      conversationId: conversation._id,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current?.emit('send-message', newMessage);
    setMessage('');
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-240px)] min-h-[500px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]">
      <ChatHeader />

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8"
      >
        {messages.length === 0 && !loading && <ChatEmptyState />}

        {loading ? (
          <ChatLoading />
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} user={user} />
          ))
        )}
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
      />
    </div>
  );
}
