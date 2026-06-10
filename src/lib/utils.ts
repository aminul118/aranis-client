import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractPlainText = (content?: string): string => {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      const extract = (nodes: any[]): string => {
        return nodes
          .map((node) => {
            if (node.text) return node.text;
            if (node.children) return extract(node.children);
            return '';
          })
          .join(' ');
      };
      return extract(parsed);
    }
    return content;
  } catch (e) {
    // If it's not valid JSON, it might be plain text or HTML.
    return content.replace(/<[^>]*>?/gm, '');
  }
};

export const formatRole = (role?: string): string => {
  if (!role) return '';
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  if (role === 'ADMIN') return 'Admin';
  if (role === 'USER') return 'User';
  return (
    role.charAt(0).toUpperCase() +
    role.slice(1).toLowerCase().replace(/_/g, ' ')
  );
};

export const formatDate = (
  date: string | Date,
  formatStr: string = 'dd MMM yyyy, hh:mm a',
): string => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};
