import { createContext, TransitionStartFunction, useContext } from 'react';

const TransitionContext = createContext<{
  startTransition: TransitionStartFunction;
  isPending: boolean;
  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;
} | null>(null);

const useTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useTransition must be used inside ClientTableWrapper');
  }
  return ctx;
};

export { TransitionContext, useTransition };
