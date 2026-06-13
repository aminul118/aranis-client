import HtmlContent from '@/components/rich-text/core/html-content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  const hasVideo = !!product.youtubeVideoUrl;
  const hasRefundPolicy = stripHtml(product.refundPolicy || '').length > 0;
  const hasReturnPolicy = stripHtml(product.returnPolicy || '').length > 0;

  if (!hasDescText && !hasVideo && !hasRefundPolicy && !hasReturnPolicy) {
    return null;
  }

  const defaultValues = [];
  if (hasDescText) defaultValues.push('description');

  return (
    <div className="pt-8">
      <Accordion
        type="multiple"
        defaultValue={defaultValues}
        className="w-full"
      >
        {hasDescText && (
          <AccordionItem value="description">
            <AccordionTrigger className="text-foreground text-xl font-bold tracking-tight uppercase hover:no-underline">
              Description
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-6">
                <HtmlContent
                  content={product.description || ''}
                  className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {hasVideo && (
          <AccordionItem value="video">
            <AccordionTrigger className="text-foreground text-xl font-bold tracking-tight uppercase hover:no-underline">
              Product Video
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col items-center pt-4 pb-6">
                <DraggableVideoPlayer
                  youtubeVideoUrl={product.youtubeVideoUrl}
                  getYoutubeEmbedUrl={getYoutubeEmbedUrl}
                />
                <p className="text-muted-foreground mt-4 text-center text-sm font-medium italic">
                  Experience the elegance and movement of this piece in motion.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {hasRefundPolicy && (
          <AccordionItem value="refund">
            <AccordionTrigger className="text-foreground text-xl font-bold tracking-tight uppercase hover:no-underline">
              Refund Policy
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-6">
                <HtmlContent
                  content={product.refundPolicy || ''}
                  className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {hasReturnPolicy && (
          <AccordionItem value="return">
            <AccordionTrigger className="text-foreground text-xl font-bold tracking-tight uppercase hover:no-underline">
              Return Policy
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-6">
                <HtmlContent
                  content={product.returnPolicy || ''}
                  className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ProductDetailMobileSections;
