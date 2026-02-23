import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PortalButton = () => {
  return (
    <Button
      asChild
      className="group relative overflow-hidden rounded-full bg-slate-900 px-6 font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
    >
      <Link href="/login">
        {/* Rotating Animated Border (Always Active) */}
        <div className="absolute inset-0 rounded-full border border-white/10 p-px">
          <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#06b6d4_50%,#3b82f6_100%)] opacity-100" />
        </div>

        {/* Button Content Background */}
        <div className="absolute inset-px rounded-full bg-slate-900 transition-colors duration-300 group-hover:bg-slate-950" />

        <span className="relative z-10 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent transition-colors duration-300 group-hover:text-white">
          Portal
        </span>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        {/* Permanent subtle glow shadow */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_15px_0_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:shadow-[0_0_25px_0_rgba(59,130,246,0.6)]" />
      </Link>
    </Button>
  );
};

export default PortalButton;
