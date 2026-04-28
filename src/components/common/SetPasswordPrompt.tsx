'use client';

import { IUser } from '@/types';
import { ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import SetPasswordModal from './SetPasswordModal';

interface SetPasswordPromptProps {
  user: IUser;
}

const SetPasswordPrompt = ({ user }: SetPasswordPromptProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (user?.hasPassword || !isVisible) {
    return null;
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-sm transition-all hover:bg-amber-500/10">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground absolute top-4 right-4 z-10 rounded-full p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-amber-500/20 hover:text-amber-500"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="rounded-full bg-amber-500/20 p-3">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-500">
                Secure Your Account
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                You haven't set a password for your account yet. Set a password
                to log in more easily and securely.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-amber-500 text-white hover:bg-amber-600 sm:w-auto"
          >
            Set Password Now
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <SetPasswordModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
};

export default SetPasswordPrompt;
