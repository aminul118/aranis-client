'use client';

import { cn } from '@/lib/utils';
import { parseVideoUrl } from '@platejs/media';
import { Play } from 'lucide-react';
import type { TCaptionElement, TResizableProps, TVideoElement } from 'platejs';
import { NodeApi } from 'platejs';
import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import { useEffect, useRef, useState } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export function VideoElementStatic(
  props: SlateElementProps<TVideoElement & TCaptionElement & TResizableProps>,
) {
  const { align = 'center', caption, url, width } = props.element;

  const videoData = parseVideoUrl(url);
  const isYoutube = videoData?.provider === 'youtube';
  const embed = videoData;
  const provider = embed?.provider;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleActivity = () => {
    setIsUserActive(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      handleActivity();
    } else {
      setIsUserActive(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <SlateElement className="py-2.5" {...props}>
      <div style={{ textAlign: align as any }}>
        <figure
          className="group relative m-0 inline-block max-w-full cursor-default"
          style={{ width: width || '100%' }}
          onMouseMove={handleActivity}
          onMouseEnter={() => setIsUserActive(true)}
        >
          {isYoutube ? (
            <div className="relative" onClick={() => setIsPlaying(true)}>
              <LiteYouTubeEmbed
                id={embed!.id!}
                title="youtube"
                wrapperClass={cn(
                  'rounded-sm',
                  'relative block cursor-pointer bg-black bg-center bg-cover [contain:content]',
                  'after:block after:pb-[var(--aspect-ratio)] after:content-[""]',
                  '[&_>_iframe]:absolute [&_>_iframe]:top-0 [&_>_iframe]:left-0 [&_>_iframe]:size-full',
                )}
              />
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500',
                  isUserActive && !isPlaying ? 'opacity-80' : 'opacity-0',
                )}
              >
                <div className="rounded-full bg-black/50 p-4">
                  <Play className="size-10 fill-white text-white" />
                </div>
              </div>
            </div>
          ) : embed ? (
            <div
              className={cn(
                'relative w-full',
                provider === 'vimeo' && 'pb-[75%]',
                provider === 'youku' && 'pb-[56.25%]',
                provider === 'dailymotion' && 'pb-[56.0417%]',
                provider === 'coub' && 'pb-[51.25%]',
              )}
              onClick={() => setIsPlaying(true)}
            >
              <iframe
                className={cn(
                  'absolute top-0 left-0 size-full rounded-sm border-0',
                )}
                title="embed"
                src={embed.url}
                allowFullScreen
              />
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500',
                  isUserActive && !isPlaying ? 'opacity-80' : 'opacity-0',
                )}
              >
                <div className="rounded-full bg-black/50 p-4">
                  <Play className="size-10 fill-white text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                className="w-full max-w-full rounded-sm object-cover px-0"
                src={url}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500',
                  isUserActive && !isPlaying ? 'opacity-80' : 'opacity-0',
                )}
              >
                <div className="rounded-full bg-black/50 p-4">
                  <Play className="size-10 fill-white text-white" />
                </div>
              </div>
            </div>
          )}

          {caption && (
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {NodeApi.string(caption[0])}
            </figcaption>
          )}
        </figure>
      </div>
      {props.children}
    </SlateElement>
  );
}
