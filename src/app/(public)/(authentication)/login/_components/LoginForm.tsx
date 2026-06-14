'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import OtpLoginForm from './OtpLoginForm';
import PasswordLoginForm from './PasswordLoginForm';

const LoginForm = () => {
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700 ease-out">
      <Tabs
        value={loginMode}
        onValueChange={(v: any) => setLoginMode(v)}
        className="w-full"
      >
        <TabsList className="mb-6 flex h-12 w-full overflow-hidden rounded-full bg-[#334155]/60 p-0 shadow-inner dark:bg-slate-800/80">
          <TabsTrigger
            value="otp"
            className="h-full flex-1 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            OTP
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="h-full flex-1 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="otp" className="mt-0 outline-none">
          <OtpLoginForm />
        </TabsContent>

        <TabsContent value="password" className="mt-0 outline-none">
          <PasswordLoginForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginForm;
