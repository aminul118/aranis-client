import { z } from 'zod';

const linksSchema = z.object({
  facebook: z.string().url('Invalid Facebook URL'),
  linkedIn: z.string().url('Invalid LinkedIn URL'),
  github: z.string().url('Invalid GitHub URL'),
  telegram: z.string().url('Invalid Telegram URL'),
  whatsapp: z.string().url('Invalid WhatsApp URL'),
  resume: z.string().url('Invalid Resume URL'),
});

type LinksFormValues = z.infer<typeof linksSchema>;

export { linksSchema };
export type { LinksFormValues };
