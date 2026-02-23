import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Lumiere',
  description: 'Learn about the terms and conditions for using the Lumiere e-commerce platform.',
};

const TermsConditionsPage = () => {
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
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
              Terms & <span className="text-blue-500">Conditions</span>
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Clock size={16} />
              <span>Last updated: February 23, 2026</span>
            </div>
          </header>

          <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-10 text-muted-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">1. Introduction</h2>
              <p>
                Welcome to Lumiere. By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">2. Use of License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Lumiere's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display;</li>
                <li>Attempt to decompile or reverse engineer any software contained on Lumiere's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">3. Disclaimer</h2>
              <p>
                The materials on Lumiere's website are provided on an 'as is' basis. Lumiere makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">4. Limitations</h2>
              <p>
                In no event shall Lumiere or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Lumiere's website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on Lumiere's website could include technical, typographical, or photographic errors. Lumiere does not warrant that any of the materials on its website are accurate, complete or current. Lumiere may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-sm">6. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Lumiere operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
            </section>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-10">
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="font-black text-xl text-foreground">Have questions about our terms?</p>
                <p className="text-muted-foreground">Our legal team is here to help you understand your rights.</p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
