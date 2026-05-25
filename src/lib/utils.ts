import { clsx, type ClassValue } from 'clsx';
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
