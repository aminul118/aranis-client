export default function ChatHeader() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5 dark:border-white/10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-sm">
          CS
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Customer Support
          </h3>
          <p className="mt-0.5 text-[10px] font-bold tracking-widest text-green-500 uppercase">
            Online Support Active
          </p>
        </div>
      </div>
    </div>
  );
}
