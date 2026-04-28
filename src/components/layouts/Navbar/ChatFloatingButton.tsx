'use client';

import { getSocket, useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import {
  getMessages,
  getOrCreateConversation,
  markAsSeen,
} from '@/services/chat/chat';
import { IUser } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCheck, MessageCircle, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ChatFloatingButtonProps {
  user: IUser | null;
}

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

const ChatFloatingButton = ({ user }: ChatFloatingButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const initChat = async () => {
      const res = await getOrCreateConversation([user._id as any]);
      if (res?.success) {
        setConversation(res.data);
        const msgRes = await getMessages(res.data._id);
        if (msgRes?.success) {
          setMessages(msgRes.data || []);
        }
      }
    };

    if (isOpen) {
      initChat();
    }
  }, [user, isOpen]);

  const handleReceiveMessage = useCallback(
    (data: any) => {
      setMessages((prev) => [...prev, data]);
      if (isOpen && conversation?._id && user?._id) {
        getSocket().emit('message-seen', {
          conversationId: conversation._id,
          userId: user._id,
        });
      } else {
        // Increment unread count if chat is closed or not for this conversation
        setUnreadCount((prev) => prev + 1);
      }
    },
    [isOpen, conversation?._id, user?._id],
  );

  const handleMessagesMarkedSeen = useCallback(
    (data: any) => {
      if (!user?._id) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === data.conversationId && msg.sender !== user._id
            ? { ...msg, status: 'seen' }
            : msg,
        ),
      );
    },
    [user?._id],
  );

  useSocket(handleReceiveMessage, user?._id, 'receive-message');
  useSocket(handleMessagesMarkedSeen, user?._id, 'messages-marked-seen');

  useEffect(() => {
    if (conversation) {
      setUnreadCount(conversation.unreadCount || 0);
    }
  }, [conversation]);

  useEffect(() => {
    if (user?._id) {
      const socket = getSocket();
      if (isOpen && conversation?._id) {
        socket.emit('join-room', conversation._id);
        socket.emit('set-active-chat', {
          userId: user._id,
          conversationId: conversation._id,
        });
        socket.emit('message-seen', {
          conversationId: conversation._id,
          userId: user._id,
        });
        markAsSeen(conversation._id);
      } else {
        socket.emit('set-active-chat', {
          userId: user._id,
          conversationId: null,
        });
      }
    }

    return () => {
      if (user?._id) {
        getSocket().emit('set-active-chat', {
          userId: user._id,
          conversationId: null,
        });
      }
    };
  }, [isOpen, conversation?._id, user?._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !conversation || !user) return;

    const newMessage = {
      sender: user._id,
      receiver:
        conversation.participants.find((p: any) => p._id !== user._id)?._id ||
        conversation.participants[0]?._id,
      senderRole: user.role,
      text: message,
      conversationId: conversation._id,
      status: 'sent',
      createdAt: new Date(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Send via socket
    getSocket().emit('send-message', newMessage);
  };

  if (!user) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute right-0 bottom-20 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:h-[600px] sm:w-[400px] dark:border-white/10 dark:bg-[#111111]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#111111] p-4 text-white dark:bg-black">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                  {conversation?.participants?.find(
                    (p: any) => p.role === 'ADMIN',
                  )?.firstName?.[0] || 'A'}
                </div>
                <div>
                  <h3 className="text-sm font-bold">Aranis Support</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                    <p className="text-[10px] text-gray-400">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 transition-colors hover:bg-white/10"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-4 dark:bg-black/20"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                    <MessageCircle size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Welcome, {user.firstName}!
                  </h4>
                  <p className="mt-1 max-w-[200px] text-xs text-gray-400">
                    How can we help you today? Our team is ready to assist you.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
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
                        'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                        isMe
                          ? 'rounded-tr-none bg-blue-600 text-white'
                          : 'rounded-tl-none bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white',
                      )}
                    >
                      {msg.text}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-gray-400">
                      <span>
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
                            <Check size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-[#111111]">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-12 text-sm transition-colors outline-none focus:border-blue-500/50 dark:border-white/10 dark:bg-white/5"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="absolute right-1 flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-blue-600/40 active:scale-95"
      >
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 animate-bounce items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white dark:border-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle
            size={24}
            className="transition-transform group-hover:rotate-12"
          />
        )}
      </button>
    </div>
  );
};

export default ChatFloatingButton;
