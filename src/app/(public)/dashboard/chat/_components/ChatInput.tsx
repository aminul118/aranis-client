import { Send } from 'lucide-react';

export default function ChatInput({
  message,
  setMessage,
  handleSend,
}: {
  message: string;
  setMessage: (m: string) => void;
  handleSend: () => void;
}) {
  return (
    <div className="shrink-0 border-t border-gray-100 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="relative flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-sm text-gray-900 transition-colors outline-none focus:border-blue-500/50 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          <Send size={20} className="mr-1" />
        </button>
      </div>
    </div>
  );
}
