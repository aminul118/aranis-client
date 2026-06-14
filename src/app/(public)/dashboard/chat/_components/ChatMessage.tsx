import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

export default function ChatMessage({ msg, user }: { msg: any; user: any }) {
  const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
  const isMe = senderId === user._id;

  return (
    <div className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm',
          isMe
            ? 'rounded-tr-none bg-blue-600 text-white'
            : 'rounded-tl-none bg-gray-100 text-gray-900 dark:bg-[#1a1a1a] dark:text-gray-100',
        )}
      >
        {msg.text}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase dark:text-gray-500">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {isMe && (
          <span className="shrink-0">
            {msg.status === 'seen' ? (
              <CheckCheck size={12} className="text-blue-400" />
            ) : (
              <Check size={12} className="text-gray-400 dark:text-gray-600" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
