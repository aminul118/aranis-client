import HtmlContent from '@/components/rich-text/core/html-content';
import { ISiteSetting } from '@/services/settings/settings';
import { IProduct } from '@/types';
import { DraggableVideoPlayer } from './DraggableVideoPlayer';

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
          <DraggableVideoPlayer
            videoUrl={product.videoUrl}
            youtubeVideoUrl={product.youtubeVideoUrl}
            getYoutubeEmbedUrl={getYoutubeEmbedUrl}
          />
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
