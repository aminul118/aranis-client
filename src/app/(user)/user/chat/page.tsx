'use client';

import { cn } from '@/lib/utils';
import {
  getMessages,
  getOrCreateConversation,
  markAsSeen,
} from '@/services/chat/chat';
import { getMe } from '@/services/user/users';
import { Check, CheckCheck, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

export default function UserChatPage() {
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

    socket.on('connect', () => {
      socket.emit('join-user-room', user._id);
      if (conversation?._id) {
        socket.emit('join-room', conversation._id);
        socket.emit('set-active-chat', {
          userId: user._id,
          conversationId: conversation._id,
        });
      }
    });

    socket.on('receive-message', (data) => {
      if (conversation?._id === data.conversationId) {
        setMessages((prev) => {
          // Prevent duplicates if optimistic update already added it
          if (prev.find((m) => m._id === data._id)) return prev;
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

    const adminParticipant = conversation.participants.find(
      (p: any) => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN',
    );

    const newMessage: any = {
      sender: user._id,
      senderRole: user.role,
      receiver: adminParticipant?._id,
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
    <div className="flex h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/5 dark:bg-[#0a0a0a]">
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/30 dark:bg-black/20">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              CS
            </div>
            <div>
              <h3 className="text-sm font-bold">Customer Support</h3>
              <p className="text-[10px] font-bold tracking-widest text-green-500 uppercase">
                Online Support Active
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-8">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                <MessageCircle size={40} />
              </div>
              <h2 className="mb-3 text-xl font-black tracking-[0.2em] uppercase">
                Live Chat
              </h2>
              <p className="max-w-sm text-xs text-gray-400">
                Start a conversation with our support team. We're here to help
                you in real-time.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const senderId =
                typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
              const isMe = senderId === user._id;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col',
                    isMe ? 'items-end' : 'items-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm',
                      isMe
                        ? 'rounded-tr-none bg-blue-600 text-white'
                        : 'rounded-tl-none border border-gray-100 bg-white text-gray-900 dark:border-white/5 dark:bg-[#111111] dark:text-gray-100',
                    )}
                  >
                    {msg.text}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMe && (
                      <span className="shrink-0">
                        {msg.status === 'seen' ? (
                          <CheckCheck size={12} className="text-blue-500" />
                        ) : (
                          <Check size={12} className="text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-6 dark:border-white/5 dark:bg-[#0a0a0a]">
          <div className="relative flex items-center gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 text-sm transition-colors outline-none focus:border-blue-500/50 dark:border-white/5 dark:bg-white/5"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="rounded-2xl bg-blue-600 p-4 text-white transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
