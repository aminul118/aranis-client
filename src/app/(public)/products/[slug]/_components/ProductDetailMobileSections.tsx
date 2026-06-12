import HtmlContent from '@/components/rich-text/core/html-content';
import { ISiteSetting } from '@/services/settings/settings';
import { IProduct } from '@/types';

interface ProductDetailMobileSectionsProps {
  product: IProduct;
  settings?: ISiteSetting;
  getYoutubeEmbedUrl: (url: string) => string;
}

export const ProductDetailMobileSections = ({
  product,
  settings,
  getYoutubeEmbedUrl,
}: ProductDetailMobileSectionsProps) => {
  const stripHtml = (html: string) =>
    (html || '').replace(/<[^>]*>?/gm, '').trim();

  const hasDescText = stripHtml(product.description || '').length > 0;
  const hasVideo = !!product.youtubeVideoUrl || !!product.videoUrl;
  const hasRefundPolicy = stripHtml(product.refundPolicy || '').length > 0;
  const hasReturnPolicy = stripHtml(product.returnPolicy || '').length > 0;

  return (
    <div className="border-border/50 flex flex-col gap-12 border-t pt-8">
      {hasDescText && (
        <section>
          <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight uppercase">
            Description
          </h2>
          <div className="space-y-8">
            <HtmlContent
              content={product.description || ''}
              className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
            />
          </div>
        </section>
      )}

      {hasVideo && (
        <section>
          <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight uppercase">
            Product Video
          </h2>
          {!!product.youtubeVideoUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(product.youtubeVideoUrl)}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="origin"
              ></iframe>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl">
              <video
                src={product.videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="h-auto max-h-[80vh] w-full object-contain"
              />
            </div>
          )}
          <p className="text-muted-foreground mt-4 text-center text-sm font-medium italic">
            Experience the elegance and movement of this piece in motion.
          </p>
        </section>
      )}

      {hasRefundPolicy && (
        <section>
          <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight uppercase">
            Refund Policy
          </h2>
          <div className="space-y-8">
            <HtmlContent
              content={product.refundPolicy || ''}
              className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
            />
          </div>
        </section>
      )}

      {hasReturnPolicy && (
        <section>
          <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight uppercase">
            Return Policy
          </h2>
          <div className="space-y-8">
            <HtmlContent
              content={product.returnPolicy || ''}
              className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailMobileSections;
