import HtmlContent from '@/components/rich-text/core/html-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IProduct } from '@/services/product/product.interface';
import type { ISiteSetting } from '@/services/settings/settings.interface';
import { DraggableVideoPlayer } from './DraggableVideoPlayer';

interface ProductDetailTabsProps {
  product: IProduct;
  settings?: ISiteSetting;
  getYoutubeEmbedUrl: (url: string) => string;
}

export const ProductDetailTabs = ({
  product,
  settings,
  getYoutubeEmbedUrl,
}: ProductDetailTabsProps) => {
  const stripHtml = (html: string) =>
    (html || '').replace(/<[^>]*>?/gm, '').trim();

  const hasDescText = stripHtml(product.description || '').length > 0;

  const hasDescriptionTab = hasDescText;

  const hasRefundPolicy = stripHtml(product.refundPolicy || '').length > 0;
  const hasReturnPolicy = stripHtml(product.returnPolicy || '').length > 0;

  const defaultTab = hasDescriptionTab
    ? 'description'
    : product.youtubeVideoUrl
      ? 'video'
      : hasRefundPolicy
        ? 'refund'
        : hasReturnPolicy
          ? 'return'
          : undefined;

  const tabCount = [
    hasDescriptionTab,
    !!product.youtubeVideoUrl,
    hasRefundPolicy,
    hasReturnPolicy,
  ].filter(Boolean).length;

  if (tabCount === 0) return null;

  return (
    <div className="space-y-10 pt-8">
      <Tabs defaultValue={defaultTab} className="w-full">
        {tabCount > 1 && (
          <TabsList className="mb-12 flex h-12 w-full max-w-2xl overflow-x-auto rounded-full bg-[#334155]/60 p-0 shadow-inner dark:bg-slate-800/80">
            {hasDescriptionTab && (
              <TabsTrigger
                value="description"
                className="flex h-full flex-1 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Description
              </TabsTrigger>
            )}
            {!!product.youtubeVideoUrl && (
              <TabsTrigger
                value="video"
                className="flex h-full flex-1 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Product Video
              </TabsTrigger>
            )}
            {hasRefundPolicy && (
              <TabsTrigger
                value="refund"
                className="flex h-full flex-1 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Refund Policy
              </TabsTrigger>
            )}
            {hasReturnPolicy && (
              <TabsTrigger
                value="return"
                className="flex h-full flex-1 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Return Policy
              </TabsTrigger>
            )}
          </TabsList>
        )}

        <TabsContent value="description" className="mt-0">
          <div className="space-y-8">
            {hasDescText && (
              <div>
                <HtmlContent
                  content={product.description || ''}
                  className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                />
              </div>
            )}
          </div>
        </TabsContent>

        {!!product.youtubeVideoUrl && (
          <TabsContent
            value="video"
            className="mt-0 flex flex-col items-center"
          >
            <DraggableVideoPlayer
              youtubeVideoUrl={product.youtubeVideoUrl}
              getYoutubeEmbedUrl={getYoutubeEmbedUrl}
            />
            <p className="text-muted-foreground mt-4 text-center text-sm font-medium italic">
              Experience the elegance and movement of this piece in motion.
            </p>
          </TabsContent>
        )}

        {hasRefundPolicy && (
          <TabsContent value="refund" className="mt-0">
            <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
              <HtmlContent content={product.refundPolicy || ''} />
            </div>
          </TabsContent>
        )}

        {hasReturnPolicy && (
          <TabsContent value="return" className="mt-0">
            <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
              <HtmlContent content={product.returnPolicy || ''} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProductDetailTabs;
