import { Mail, MapPin, Phone } from 'lucide-react';

const contactDetails = [
  {
    icon: Phone,
    title: 'Phone',
    value: '01633501122',
    href: 'tel:01633501122',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'support@Aranisfash.com',
    href: 'mailto:support@Aranisfash.com',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    value: 'Banani, Dhaka, Bangladesh',
    href: null,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const ContactInfo = () => {
  return (
    <div className="flex h-full max-w-xl flex-col justify-center">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contact Our Team
        </h3>
        <p className="text-gray-500 dark:text-white/60">
          Have questions about our products or your order? We're here to help.
          Reach out to us through any of the channels below or fill out the
          form.
        </p>

        <div className="mt-8 space-y-4">
          {contactDetails.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-500/20 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-white/40">
                  {item.title}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
