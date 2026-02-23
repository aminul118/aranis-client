'use client';

import { cn } from '@/lib/utils';
import { parseTwitterUrl, parseVideoUrl } from '@platejs/media';
import { Play } from 'lucide-react';
import type { TMediaEmbedElement } from 'platejs';
import { NodeApi } from 'platejs';
import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import { useEffect, useRef, useState } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { Tweet } from 'react-tweet';

export function MediaEmbedElementStatic(
  props: SlateElementProps<TMediaEmbedElement>,
) {
  const { align = 'center', url } = props.element;

  const twitterData = parseTwitterUrl(url);
  const videoData = parseVideoUrl(url);

  const isTweet = !!twitterData;
  const isVideo = !!videoData;
  const isYoutube = videoData?.provider === 'youtube';
  const embed = twitterData || videoData;
  const provider = embed?.provider;

  const [isUserActive, setIsUserActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleActivity = () => {
    setIsUserActive(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // For embeds, we don't always know play state,
    // but we usually want to hide it eventually if they clicked inside
    timerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <SlateElement className="py-2.5" {...props}>
      <figure
        className="group relative m-0 w-full cursor-default"
        style={{ textAlign: align as any }}
        onMouseMove={handleActivity}
        onMouseEnter={() => setIsUserActive(true)}
      >
        <div
          className={cn('relative inline-block max-w-full')}
          style={{ width: (props.element.width as string) || '100%' }}
        >
          {isVideo ? (
            isYoutube ? (
              <div className="relative">
                <LiteYouTubeEmbed
                  id={embed!.id!}
                  title="youtube"
                  wrapperClass={cn(
                    'rounded-sm',
                    'relative block cursor-pointer bg-black bg-center bg-cover [contain:content]',
                    '[&.lyt-activated]:before:absolute [&.lyt-activated]:before:top-0 [&.lyt-activated]:before:h-[60px] [&.lyt-activated]:before:w-full [&.lyt-activated]:before:bg-top [&.lyt-activated]:before:bg-repeat-x [&.lyt-activated]:before:pb-[50px] [&.lyt-activated]:before:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                    '[&.lyt-activated]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)]',
                    'after:block after:pb-[var(--aspect-ratio)] after:content-[""]',
                    '[&_>_iframe]:absolute [&_>_iframe]:top-0 [&_>_iframe]:left-0 [&_>_iframe]:size-full',
                    '[&_>_.lty-playbtn]:z-1 [&_>_.lty-playbtn]:h-[46px] [&_>_.lty-playbtn]:w-[70px] [&_>_.lty-playbtn]:rounded-[14%] [&_>_.lty-playbtn]:bg-[#212121] [&_>_.lty-playbtn]:opacity-80 [&_>_.lty-playbtn]:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                    '[&:hover_>_.lty-playbtn]:bg-[red] [&:hover_>_.lty-playbtn]:opacity-100',
                    '[&_>_.lty-playbtn]:before:border-[transparent_transparent_transparent_#fff] [&_>_.lty-playbtn]:before:border-y-[11px] [&_>_.lty-playbtn]:before:border-r-0 [&_>_.lty-playbtn]:before:border-l-[19px] [&_>_.lty-playbtn]:before:content-[""]',
                    '[&_>_.lty-playbtn]:absolute [&_>_.lty-playbtn]:top-1/2 [&_>_.lty-playbtn]:left-1/2 [&_>_.lty-playbtn]:[transform:translate3d(-50%,-50%,0)]',
                    '[&_>_.lty-playbtn]:before:absolute [&_>_.lty-playbtn]:before:top-1/2 [&_>_.lty-playbtn]:before:left-1/2 [&_>_.lty-playbtn]:before:[transform:translate3d(-50%,-50%,0)]',
                    '[&.lyt-activated]:cursor-[unset]',
                    '[&.lyt-activated]:before:pointer-events-none [&.lyt-activated]:before:opacity-0',
                    '[&.lyt-activated_>_.lty-playbtn]:pointer-events-none [&.lyt-activated_>_.lty-playbtn]:opacity-0!',
                  )}
                />
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500',
                    isUserActive ? 'opacity-80' : 'opacity-0',
                  )}
                >
                  <div className="rounded-full bg-black/50 p-4">
                    <Play className="size-10 fill-white text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'relative w-full',
                  provider === 'vimeo' && 'pb-[75%]',
                  provider === 'youku' && 'pb-[56.25%]',
                  provider === 'dailymotion' && 'pb-[56.0417%]',
                  provider === 'coub' && 'pb-[51.25%]',
                )}
              >
                <iframe
                  className={cn(
                    'absolute top-0 left-0 size-full rounded-sm border-0',
                  )}
                  title="embed"
                  src={embed!.url}
                  allowFullScreen
                />
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500',
                    isUserActive ? 'opacity-80' : 'opacity-0',
                  )}
                >
                  <div className="rounded-full bg-black/50 p-4">
                    <Play className="size-10 fill-white text-white" />
                  </div>
                </div>
              </div>
            )
          ) : null}

          {isTweet && (
            <div className={cn('[&_.react-tweet-theme]:my-0')}>
              <Tweet id={embed!.id!} />
            </div>
          )}
        </div>
        {(props.element as any).caption?.[0] && (
          <figcaption
            style={{
              width: (props.element.width as string) || '100%',
              margin: '0 auto',
            }}
            className="text-muted-foreground mt-2 text-center text-sm"
          >
            {NodeApi.string((props.element as any).caption[0])}
          </figcaption>
        )}
      </figure>

      {props.children}
    </SlateElement>
  );
}
