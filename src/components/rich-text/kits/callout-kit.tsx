'use client';

import { CalloutPlugin } from '@platejs/callout/react';

import { CalloutElement } from '@/components/rich-text/ui/callout-node';

export const CalloutKit = [CalloutPlugin.withComponent(CalloutElement)];
