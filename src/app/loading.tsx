import CenterSpinner from '@/components/common/loader/CenterSpinner';

const GlobalLoading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CenterSpinner />
    </div>
  );
};

export default GlobalLoading;
