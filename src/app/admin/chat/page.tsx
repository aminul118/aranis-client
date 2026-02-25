'use client';

import { getSocket, useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import {
  getMessages,
  getMyConversations,
  markAsSeen,
} from '@/services/chat/chat';
import { getMe } from '@/services/user/users';
import {
  Check,
  CheckCheck,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function AdminChatPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const res = await getMe();
      if (res?.success) setAdmin(res.data);
      fetchConversations();
    };
    init();
  }, []);

  const handleReceiveMessage = useCallback(
    (data: any) => {
      // If message is for currently active chat
      if (activeChat && data.conversationId === activeChat._id) {
        setMessages((prev) => [...prev, data]);
        getSocket().emit('message-seen', {
          conversationId: activeChat._id,
          userId: admin?._id,
        });
        markAsSeen(activeChat._id);
      } else {
        // Update unread count in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c._id === data.conversationId
              ? {
                  ...c,
                  unreadCount: (c.unreadCount || 0) + 1,
                  lastMessage: data.text,
                  lastMessageTime: new Date().toISOString(),
                }
              : c,
          ),
        );
      }
    },
    [activeChat?._id, admin?._id],
  );

  const handleNewUserMessage = useCallback((data: any) => {
    // If it's a new conversation not in list
    setConversations((prev) => {
      if (!prev.find((c) => c._id === data.conversationId)) {
        fetchConversations();
      }
      return prev;
    });
  }, []);

  const handleMessagesMarkedSeen = useCallback(
    (data: any) => {
      if (activeChat?._id === data.conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === data.userId ? msg : { ...msg, status: 'seen' },
          ),
        );
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === data.conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    },
    [activeChat?._id],
  );

  useSocket(handleReceiveMessage, admin?._id, 'receive-message', ['admins']);
  useSocket(handleNewUserMessage, admin?._id, 'new-user-message', ['admins']);
  useSocket(handleMessagesMarkedSeen, admin?._id, 'messages-marked-seen', [
    'admins',
  ]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
      getSocket().emit('join-room', activeChat._id);
      if (admin) {
        // eslint-disable-next-line no-console
        console.log(`Admin ${admin._id} entering chat ${activeChat._id}`);
        getSocket().emit('message-seen', {
          conversationId: activeChat._id,
          userId: admin._id,
        });
        getSocket().emit('set-active-chat', {
          userId: admin._id,
          conversationId: activeChat._id,
        });
      }
    } else if (admin) {
      // eslint-disable-next-line no-console
      console.log(`Admin ${admin._id} leaving chat`);
      getSocket().emit('set-active-chat', {
        userId: admin._id,
        conversationId: null,
      });
    }

    return () => {
      if (admin) {
        getSocket().emit('set-active-chat', {
          userId: admin._id,
          conversationId: null,
        });
      }
    };
  }, [activeChat?._id, admin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    const res = await getMyConversations();
    if (res?.success) {
      setConversations(res.data || []);
    }
  };

  const fetchMessages = async (id: string) => {
    setLoading(true);
    const res = await getMessages(id);
    if (res?.success) {
      setMessages(res.data || []);
      // Mark as seen in DB
      await markAsSeen(id);
      // Notify via socket to sync other clients/components (e.g. NotificationBell)
      getSocket().emit('message-seen', {
        conversationId: id,
        userId: admin?._id,
      });
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!message.trim() || !activeChat || !admin) return;

    const userParticipant =
      activeChat.participants.find((p: any) => p.role === 'USER') ||
      activeChat.participants[0];

    const newMessage = {
      sender: admin._id,
      senderRole: admin.role,
      receiver: userParticipant._id,
      text: message,
      conversationId: activeChat._id,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    getSocket().emit('send-message', newMessage);
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/5 dark:bg-[#0a0a0a]">
      {/* Sidebar: Chat List */}
      <div className="flex w-[350px] shrink-0 flex-col border-r border-gray-100 dark:border-white/5">
        <div className="border-b border-gray-100 p-6 dark:border-white/5">
          <h1 className="mb-4 text-xl font-black tracking-widest uppercase">
            Support Center
          </h1>
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2.5 pr-4 pl-10 text-xs transition-colors outline-none focus:border-blue-500/50 dark:border-white/5 dark:bg-white/5"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold tracking-widest text-gray-400 uppercase">
              No active tickets
            </div>
          ) : (
            conversations.map((conv) => {
              const userParticipant =
                conv.participants.find((p: any) => p.role === 'USER') ||
                conv.participants[0];
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 border-b border-gray-50 p-4 transition-all hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5',
                    activeChat?._id === conv._id &&
                      'border-l-4 border-l-blue-600 bg-blue-50/50 dark:bg-blue-500/5',
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-white/10">
                      {userParticipant?.picture ? (
                        <Image
                          src={userParticipant.picture}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-600 font-bold text-white">
                          {userParticipant?.firstName?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-[#0a0a0a]"></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-start justify-between">
                      <h3 className="truncate text-sm font-bold">
                        {userParticipant?.firstName} {userParticipant?.lastName}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400">
                        {conv.lastMessageTime
                          ? new Date(conv.lastMessageTime).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' },
                            )
                          : ''}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      {conv.lastMessage || 'Open ticket'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="min-w-[18px] rounded-full bg-blue-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main: Chat Thread */}
      {activeChat ? (
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/30 dark:bg-black/20">
          {/* Active Chat Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {activeChat.participants.find((p: any) => p.role === 'USER')
                  ?.firstName?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  {
                    activeChat.participants.find((p: any) => p.role === 'USER')
                      ?.firstName
                  }{' '}
                  {
                    activeChat.participants.find((p: any) => p.role === 'USER')
                      ?.lastName
                  }
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-green-500 uppercase">
                  Customer Support Active
                </p>
              </div>
            </div>
            <button className="p-2 text-gray-400 transition-colors hover:text-gray-900">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Active Chat Messages */}
          <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-8">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe =
                  msg.sender === admin?._id ||
                  msg.sender?._id === admin?._id ||
                  msg.senderRole === 'ADMIN' ||
                  (typeof msg.sender === 'object' &&
                    msg.sender.role === 'ADMIN');
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

          {/* Active Chat Input */}
          <div className="shrink-0 border-t border-gray-100 bg-white p-6 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a response..."
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
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-50/30 p-12 text-center dark:bg-black/20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
            <MessageCircle size={40} />
          </div>
          <h2 className="mb-3 text-xl font-black tracking-[0.2em] uppercase">
            Customer Support
          </h2>
          <p className="max-w-sm text-xs text-gray-400">
            Select a ticket from the sidebar to start assisting users in
            real-time. All active conversations are visible to the support team.
          </p>
        </div>
      )}
    </div>
  );
}
