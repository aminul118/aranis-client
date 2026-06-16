'use client';

export const dynamic = 'force-dynamic';

import { getSocket, useSocket } from '@/hooks/useSocket';
import { playNotificationSound } from '@/lib/playSound';
import { markAsSeen } from '@/services/chat/chat';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatEmptyState from './ChatEmptyState';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import ChatMessage from './ChatMessage';

interface ChatClientProps {
  initialUser: any;
  initialConversation: any;
  initialMessages: any[];
}

export default function ChatClient({
  initialUser,
  initialConversation,
  initialMessages,
}: ChatClientProps) {
  const [user, setUser] = useState<any>(initialUser);
  const [messages, setMessages] = useState<any[]>(initialMessages || []);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<any>(initialConversation);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const handleReceiveMessage = useCallback(
    (data: any) => {
      if (conversation?._id === data.conversationId) {
        setMessages((prev) => {
          if (
            prev.find(
              (m) =>
                (m._id && m._id === data._id) ||
                (m.tempId && m.tempId === data.tempId),
            )
          )
            return prev;

          playNotificationSound();
          return [...prev, data];
        });
        getSocket().emit('message-seen', {
          conversationId: conversation._id,
          userId: user?._id,
        });
      }
    },
    [conversation?._id, user?._id],
  );

  const handleMessagesMarkedSeen = useCallback(
    (data: any) => {
      if (conversation?._id === data.conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === data.userId || msg.sender?._id === data.userId
              ? msg
              : { ...msg, status: 'seen' },
          ),
        );
      }
    },
    [conversation?._id],
  );

  useSocket(
    handleReceiveMessage,
    user?._id,
    'receive-message',
    conversation?._id ? [conversation._id] : [],
  );
  useSocket(
    handleMessagesMarkedSeen,
    user?._id,
    'messages-marked-seen',
    conversation?._id ? [conversation._id] : [],
  );

  useEffect(() => {
    if (user?._id && conversation?._id) {
      const socket = getSocket();
      socketRef.current = socket;

      markAsSeen(conversation._id);
      socket.emit('message-seen', {
        conversationId: conversation._id,
        userId: user._id,
      });

      socket.emit('set-active-chat', {
        userId: user._id,
        conversationId: conversation._id,
      });

      return () => {
        socket.emit('set-active-chat', {
          userId: user._id,
          conversationId: null,
        });
      };
    }
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
