import images from '@/constants/images';
import Image from 'next/image';

const AboutImage = () => {
  return (
    <div className="relative h-48 w-48">
      <div className="absolute inset-0 rotate-45 transform rounded-[20%] bg-gradient-to-r from-pink-500 to-purple-500"></div>
      <div className="relative flex h-full w-full rotate-45 transform items-center justify-center overflow-hidden rounded-[20%] bg-black">
        <div className="h-full w-full -rotate-45 transform">
          <Image
            src={images.aminul2}
            alt="Profile Picture"
            width={400}
            height={400}
            className="scale-150 rounded-[20%] object-cover"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutImage;
