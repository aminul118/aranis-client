'use client';

import { Button } from '@/components/ui/button';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import ButtonSpinner from '../loader/ButtonSpinner';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: ReactNode;
  loading?: boolean;
  loadingEffect?: boolean;
  loadingText?: string;
}

const SubmitButton = ({
  text = 'Submit',
  className,
  icon,
  loading = false,
  loadingEffect = false,
  disabled = false,
  loadingText = 'Submitting',
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={className}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      <span className="flex items-center gap-2">
        {loading ? (
          <>
            <ButtonSpinner />
            {loadingEffect ? `${loadingText} ...` : text}
          </>
        ) : (
          <>
            {icon && icon}
            {text}
          </>
        )}
      </span>
    </Button>
  );
};

export default SubmitButton;
