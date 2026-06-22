import SectionHeading from '@/components/ui/SectionHeading';
import type { ISiteSetting } from '@/services/settings/settings.interface';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

interface Props {
  settings?: ISiteSetting;
}

const Contact = ({ settings }: Props) => {
  return (
    <section
      className="bg-background relative overflow-hidden py-20 lg:py-32"
      id="contact"
    >
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/5" />
        <div className="absolute right-[10%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-500/5" />
      </div>

      <div className="container mx-auto px-4">
        <SectionHeading
          heading="Get In Touch"
          description="Have a question about our products or need assistance? We'd love to hear from you."
          className="mb-16"
        />

        <div className="mx-auto flex flex-col justify-between gap-8 lg:flex-row lg:gap-12">
          {/* Left Column: Contact Info */}
          <div className="w-full space-y-8">
            <ContactInfo settings={settings} />
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-card w-full max-w-xl rounded-2xl border border-gray-100 p-6 shadow-xl backdrop-blur-md lg:p-8 dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Send us a message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
