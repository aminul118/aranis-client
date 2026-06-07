import Link from 'next/link';

const QuickActions = () => {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/user/orders"
          className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
        >
          View My Orders →
        </Link>
        <Link
          href="/products"
          className="rounded-lg bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-500 transition-colors hover:bg-purple-500/20"
        >
          Browse Products →
        </Link>
        <Link
          href="/user/settings/profile"
          className="rounded-lg bg-slate-500/10 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-500/20"
        >
          Edit Profile →
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
