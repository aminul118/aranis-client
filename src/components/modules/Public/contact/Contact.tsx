import SectionHeading from '@/components/ui/SectionHeading';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const Contact = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32" id="contact">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-[10%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <SectionHeading
          heading="Get In Touch"
          description="Have a question or want to work together? I'd love to hear from you."
          className="mb-16"
        />

        <div className="mx-auto flex flex-col justify-between gap-8 lg:flex-row lg:gap-12">
          {/* Left Column: Contact Info */}
          <div className="w-full space-y-8">
            <ContactInfo />
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md lg:p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Send me a message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
