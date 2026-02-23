import { KEYS } from 'platejs';

export const deserializeHtml = (html: string) => {
  if (typeof window === 'undefined') {
    return [{ type: KEYS.p, children: [{ text: '' }] }];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = deserialize(doc.body);

    // Ensure we always return a valid array of nodes
    if (!nodes || nodes.length === 0) {
      return [{ type: KEYS.p, children: [{ text: '' }] }];
    }

    // Clean up top-level nodes ensuring they are blocks
    return nodes.map((node: any) => {
      // If a top-level node is text or inline, wrap it in a paragraph
      if (
        node.text ||
        node.bold ||
        node.italic ||
        node.underline ||
        node.strikethrough
      ) {
        return { type: KEYS.p, children: [node] };
      }
      return node;
    });
  } catch (e) {
    console.error('HTML deserialization failed', e);
    return [{ type: KEYS.p, children: [{ text: html }] }];
  }
};

const deserialize = (el: Node): any => {
  if (el.nodeType === 3) {
    // TEXT_NODE
    const text = el.textContent;
    // Handle empty text nodes (often layout whitespace)
    if (!text || text.trim().length === 0) return null;
    return { text };
  } else if (el.nodeType !== 1) {
    // ELEMENT_NODE
    return null;
  }

  const node = el as HTMLElement;
  let children = Array.from(node.childNodes)
    .map(deserialize)
    .flat()
    .filter(Boolean);

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  // Handle specific tags
  const tag = node.nodeName.toLowerCase();

  switch (tag) {
    case 'body':
      return children;
    case 'br':
      return { text: '\n' };
    case 'p':
      return { type: KEYS.p, children };
    case 'h1':
      return { type: KEYS.h1, children };
    case 'h2':
      return { type: KEYS.h2, children };
    case 'h3':
      return { type: KEYS.h3, children };
    case 'h4':
      return { type: KEYS.h4, children };
    case 'h5':
      return { type: KEYS.h5, children };
    case 'h6':
      return { type: KEYS.h6, children };
    case 'ul':
      return { type: KEYS.ul, children };
    case 'ol':
      return { type: KEYS.ol, children };
    case 'li':
      return { type: KEYS.li, children };
    case 'blockquote':
      return { type: KEYS.blockquote, children };

    // Inline marks
    case 'strong':
    case 'b':
      return children.map((child) => ({ ...child, bold: true }));
    case 'em':
    case 'i':
      return children.map((child) => ({ ...child, italic: true }));
    case 'u':
      return children.map((child) => ({ ...child, underline: true }));
    case 's':
    case 'strike':
      return children.map((child) => ({ ...child, strikethrough: true }));

    // Handle Quill specifc spans or other spans
    case 'span':
      // Check for Quill bullet UI elements and ignore them
      if (node.classList.contains('ql-ui')) {
        return null; // Ignore this node completely
      }
      return children; // Return children directly for plain spans

    default:
      return children; // Fallback: return children
  }
};
