'use client';

import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode; // Element that triggers the tooltip
  content: string; // Tooltip text or JSX
  side?: 'top' | 'bottom' | 'left' | 'right'; // Tooltip position
  className?: string; // Custom styles for TooltipContent
}

const Tooltip = ({
  children,
  content = 'Content',
  side = 'top',
  className = '',
}: TooltipProps) => {
  return (
    <ShadTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        <p>{content}</p>
      </TooltipContent>
    </ShadTooltip>
  );
};

export default Tooltip;
