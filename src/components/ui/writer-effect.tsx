'use client';
import { Typewriter } from 'react-simple-typewriter';

const WriterEffect = ({ words }: { words: string[] }) => {
  return (
    <Typewriter
      words={words}
      loop
      cursor
      cursorStyle="_"
      typeSpeed={70}
      deleteSpeed={50}
      delaySpeed={1000}
    />
  );
};

export default WriterEffect;
