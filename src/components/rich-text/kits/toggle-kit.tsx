'use client';

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '@/components/rich-text/kits/indent-kit';
import { ToggleElement } from '@/components/rich-text/ui/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
