import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMeta(
    '/privacy-policy',
    'Privacy Policy',
    'Review the privacy policy of Lumiere to understand how we protect your information.',
  );
}

export const dynamic = 'force-dynamic';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-6">
        <Link
          href="/register"
          className="text-muted-foreground hover:text-foreground group mb-12 inline-flex items-center text-xs font-bold tracking-widest uppercase transition-all"
        >
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Registration
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <div className="mb-2 flex items-center gap-3 text-blue-500">
              <ShieldCheck size={32} />
              <span className="text-xs font-black tracking-[0.3em] uppercase">
                Security First
              </span>
            </div>
            <h1 className="text-foreground text-5xl leading-none font-black tracking-tight md:text-6xl">
              Privacy <span className="text-blue-500">Policy</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-xl font-medium">
              Your privacy is our top priority. We are committed to protecting
              your personal data and being transparent about how we use it.
            </p>
          </header>

          <div className="from-border via-border h-px bg-linear-to-r to-transparent" />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert text-muted-foreground/90 max-w-none space-y-12 leading-relaxed">
            <section className="bg-secondary/10 border-border/30 space-y-4 rounded-4xl border p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2">
                  <Lock className="text-blue-500" size={20} />
                </div>
                <h2 className="text-foreground m-0 text-sm font-black tracking-widest uppercase">
                  Information We Collect
                </h2>
              </div>
              <p>
                We collect information you provide directly to us, such as when
                you create an account, make a purchase, or contact our support
                team.
              </p>
            </section>

            <section className="grid gap-10 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-foreground text-xs font-black tracking-widest uppercase">
                  How We Use Data
                </h3>
                <p className="text-sm">
                  Lumiere uses the collected data for various purposes,
                  including providing and maintaining our service, notifying you
                  about changes, and providing customer support.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-foreground text-xs font-black tracking-widest uppercase">
                  Data Security
                </h3>
                <p className="text-sm">
                  The security of your data is important to us. We implement
                  industry-standard encryption and security measures to protect
                  your information from unauthorized access.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
                Your Rights
              </h2>
              <p>
                As a user of Lumiere, you have the right to access, update, or
                delete the personal information we have on you. You can do this
                within your account settings or by contacting our support team.
              </p>
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                {[
                  'Right to be informed',
                  'Right of access',
                  'Right to rectification',
                  'Right to erasure',
                  'Right to restrict processing',
                  'Right to data portability',
                ].map((right) => (
                  <div
                    key={right}
                    className="bg-card border-border/50 flex items-center gap-3 rounded-2xl border p-4"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-foreground text-sm font-bold">
                      {right}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
                Cookies Policies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track the
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section className="border-border/50 space-y-4 border-t pt-10">
              <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-none space-y-2 p-0">
                <li className="flex items-center gap-2">
                  <span className="text-foreground font-bold">Email:</span>{' '}
                  privacy@lumiere.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-foreground font-bold">Address:</span>{' '}
                  123 Luxury Avenue, Suite 100, Digital City
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
