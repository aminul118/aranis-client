import { BaseCalloutPlugin } from '@platejs/callout';

import { CalloutElementStatic } from '@/components/rich-text/ui/callout-node-static';

export const BaseCalloutKit = [
  BaseCalloutPlugin.withComponent(CalloutElementStatic),
];
