'use client';

import { getMe } from '@/services/user/users';
import { IUser } from '@/types';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserContextType {
  user: IUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{
  children: ReactNode;
  initialUser?: IUser | null;
}> = ({ children, initialUser = null }) => {
  const [user, setUser] = useState<IUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res?.success) {
        setUser(res.data || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      refreshUser();
    }
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Return a dummy context instead of throwing to prevent Next.js HMR/Context duplicate module crashes
    return {
      user: null,
      loading: false,
      refreshUser: async () => {},
      setUser: () => {},
    };
  }
  return context;
};
