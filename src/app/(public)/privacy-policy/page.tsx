import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lumiere',
  description: 'Review the privacy policy of Lumiere to understand how we protect your information.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/register"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-12 transition-all group font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Registration
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
                <ShieldCheck size={32} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Security First</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
              Privacy <span className="text-blue-500">Policy</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-2xl">
                Your privacy is our top priority. We are committed to protecting your personal data and being transparent about how we use it.
            </p>
          </header>

          <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12 text-muted-foreground/90 leading-relaxed">
            <section className="space-y-4 bg-secondary/10 p-8 rounded-[2rem] border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Lock className="text-blue-500" size={20} />
                </div>
                <h2 className="text-foreground font-black uppercase tracking-widest text-sm m-0">Information We Collect</h2>
              </div>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team.
              </p>
            </section>

            <section className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <h3 className="text-foreground font-black uppercase tracking-widest text-xs">How We Use Data</h3>
                    <p className="text-sm">
                        Lumiere uses the collected data for various purposes, including providing and maintaining our service, notifying you about changes, and providing customer support.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-foreground font-black uppercase tracking-widest text-xs">Data Security</h3>
                    <p className="text-sm">
                        The security of your data is important to us. We implement industry-standard encryption and security measures to protect your information from unauthorized access.
                    </p>
                </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">Your Rights</h2>
              <p>
                As a user of Lumiere, you have the right to access, update, or delete the personal information we have on you. You can do this within your account settings or by contacting our support team.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                    'Right to be informed',
                    'Right of access',
                    'Right to rectification',
                    'Right to erasure',
                    'Right to restrict processing',
                    'Right to data portability'
                ].map((right) => (
                    <div key={right} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-bold text-foreground">{right}</span>
                    </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">Cookies Policies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="space-y-4 border-t border-border/50 pt-10">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none p-0 space-y-2">
                <li className="flex items-center gap-2">
                    <span className="font-bold text-foreground">Email:</span> privacy@lumiere.com
                </li>
                <li className="flex items-center gap-2">
                    <span className="font-bold text-foreground">Address:</span> 123 Luxury Avenue, Suite 100, Digital City
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
