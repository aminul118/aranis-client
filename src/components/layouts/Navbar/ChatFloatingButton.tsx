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
  siteSettings?: any;
}

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

const ChatFloatingButton = ({
  user,
  siteSettings,
}: ChatFloatingButtonProps) => {
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

  if (!user) {
    const contactNumber = siteSettings?.contactNumber || '+8801886877730';
    const whatsappNumber = contactNumber.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    return (
      <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] z-50 lg:right-6 lg:bottom-6">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-[#25D366]/40 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="30"
            height="30"
            fill="currentColor"
            className="transition-transform group-hover:rotate-12"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="absolute -top-12 right-0 scale-0 rounded-lg bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-all group-hover:scale-100">
            WHATSAPP CHAT
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] z-50 lg:right-6 lg:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute right-0 bottom-16 flex h-[70vh] w-[calc(100vw-2rem)] max-w-[350px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:h-[600px] sm:max-w-[400px] dark:border-white/10 dark:bg-[#111111]"
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
