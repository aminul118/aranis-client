import { Mail, MapPin, Phone } from 'lucide-react';

const contactDetails = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+880 17810 820 64',
    href: 'tel:+8801781082064',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'mr.aminul118@gmail.com',
    href: 'mailto:mr.aminul118@gmail.com',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Dhaka, Bangladesh',
    href: null,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const ContactInfo = () => {
  return (
    <div className="flex h-full max-w-xl flex-col justify-center">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white">
          Let's create something amazing together.
        </h3>
        <p className="text-white/60">
          I'm currently available for freelance work and full-time positions. If
          you have a project that needs some creative touch, I'd love to hear
          about it.
        </p>

        <div className="mt-8 space-y-4">
          {contactDetails.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10 hover:bg-white/10"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/40">
                  {item.title}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-medium text-white transition-colors hover:text-blue-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-medium text-white">{item.value}</span>
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
