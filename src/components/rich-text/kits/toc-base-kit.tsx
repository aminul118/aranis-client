import { BaseTocPlugin } from '@platejs/toc';

import { TocElementStatic } from '@/components/rich-text/ui/toc-node-static';

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
