'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@/components/rich-text/ui/link-node';
import { LinkFloatingToolbar } from '@/components/rich-text/ui/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];
