import { MessageCircle } from 'lucide-react';

export default function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
        <MessageCircle size={40} />
      </div>
      <h2 className="mb-3 text-xl font-black tracking-[0.2em] text-gray-900 uppercase dark:text-white">
        Live Chat
      </h2>
      <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">
        Start a conversation with our support team. We're here to help you in
        real-time.
      </p>
    </div>
  );
}
