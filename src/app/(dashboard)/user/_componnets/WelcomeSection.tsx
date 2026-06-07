import { IUser } from '@/types';

interface WelcomeSectionProps {
  user: IUser;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome back, {user?.fullName || 'User'} 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's a summary of your account activity.
      </p>
    </div>
  );
};

export default WelcomeSection;
