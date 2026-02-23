'use client';

import { type Value, TrailingBlockPlugin } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { AlignKit } from '@/components/rich-text/kits/align-kit';
import { AutoformatKit } from '@/components/rich-text/kits/autoformat-kit';
import { BasicBlocksKit } from '@/components/rich-text/kits/basic-blocks-kit';
import { BasicMarksKit } from '@/components/rich-text/kits/basic-marks-kit';
import { BlockMenuKit } from '@/components/rich-text/kits/block-menu-kit';
import { BlockPlaceholderKit } from '@/components/rich-text/kits/block-placeholder-kit';
import { CalloutKit } from '@/components/rich-text/kits/callout-kit';
import { CodeBlockKit } from '@/components/rich-text/kits/code-block-kit';
import { ColumnKit } from '@/components/rich-text/kits/column-kit';
import { CursorOverlayKit } from '@/components/rich-text/kits/cursor-overlay-kit';
import { DateKit } from '@/components/rich-text/kits/date-kit';
import { DndKit } from '@/components/rich-text/kits/dnd-kit';
import { DocxKit } from '@/components/rich-text/kits/docx-kit';
import { EmojiKit } from '@/components/rich-text/kits/emoji-kit';
import { ExitBreakKit } from '@/components/rich-text/kits/exit-break-kit';
import { FixedToolbarKit } from '@/components/rich-text/kits/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/components/rich-text/kits/floating-toolbar-kit';
import { FontKit } from '@/components/rich-text/kits/font-kit';
import { LineHeightKit } from '@/components/rich-text/kits/line-height-kit';
import { LinkKit } from '@/components/rich-text/kits/link-kit';
import { ListKit } from '@/components/rich-text/kits/list-kit';
import { MarkdownKit } from '@/components/rich-text/kits/markdown-kit';
import { MathKit } from '@/components/rich-text/kits/math-kit';
import { MediaKit } from '@/components/rich-text/kits/media-kit';
import { MentionKit } from '@/components/rich-text/kits/mention-kit';
import { SlashKit } from '@/components/rich-text/kits/slash-kit';
import { TableKit } from '@/components/rich-text/kits/table-kit';
import { TocKit } from '@/components/rich-text/kits/toc-kit';
import { ToggleKit } from '@/components/rich-text/kits/toggle-kit';

export const BlogEditorKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export type BlogEditor = TPlateEditor<Value, (typeof BlogEditorKit)[number]>;

export const useBlogEditor = () => useEditorRef<BlogEditor>();
