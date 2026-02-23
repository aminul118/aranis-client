import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/components/rich-text/ui/mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];
