import { Button } from '@/components/ui/button';
import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMeta(
    '/terms-conditions',
    'Terms & Conditions',
    'Learn about the terms and conditions for using the Lumiere e-commerce platform.',
  );
}

const TermsConditionsPage = () => {
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
            <h1 className="text-foreground text-5xl leading-none font-black tracking-tight md:text-6xl">
              Terms & <span className="text-blue-500">Conditions</span>
            </h1>
            <div className="text-muted-foreground flex items-center gap-2 font-medium">
              <Clock size={16} />
              <span>Last updated: February 23, 2026</span>
            </div>
          </header>

          <div className="from-border via-border h-px bg-gradient-to-r to-transparent" />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert text-muted-foreground/90 max-w-none space-y-10 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                1. Introduction
              </h2>
              <p>
                Welcome to Lumiere. By accessing or using our website, you agree
                to be bound by these Terms and Conditions and our Privacy
                Policy. If you do not agree to all of these terms, please do not
                use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                2. Use of License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Lumiere's website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Modify or copy the materials;</li>
                <li>
                  Use the materials for any commercial purpose, or for any
                  public display;
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on Lumiere's website;
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                3. Disclaimer
              </h2>
              <p>
                The materials on Lumiere's website are provided on an 'as is'
                basis. Lumiere makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                4. Limitations
              </h2>
              <p>
                In no event shall Lumiere or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Lumiere's website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on Lumiere's website could include
                technical, typographical, or photographic errors. Lumiere does
                not warrant that any of the materials on its website are
                accurate, complete or current. Lumiere may make changes to the
                materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-foreground text-2xl text-sm font-black tracking-widest uppercase">
                6. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of the jurisdiction in which Lumiere
                operates, and you irrevocably submit to the exclusive
                jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-10">
            <div className="bg-secondary/30 border-border/50 flex flex-col items-center justify-between gap-6 rounded-3xl border p-8 backdrop-blur-sm md:flex-row">
              <div className="space-y-1">
                <p className="text-foreground text-xl font-black">
                  Have questions about our terms?
                </p>
                <p className="text-muted-foreground">
                  Our legal team is here to help you understand your rights.
                </p>
              </div>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="rounded-full bg-blue-600 px-8 font-bold text-white hover:bg-blue-700"
                >
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
