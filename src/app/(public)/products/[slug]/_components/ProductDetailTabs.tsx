import HtmlContent from '@/components/rich-text/core/html-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ISiteSetting } from '@/services/settings/settings';
import { IProduct } from '@/types';

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

  return (
    <div className="border-border/50 space-y-10 border-t pt-8">
      <Tabs defaultValue={defaultTab} className="w-full">
        {tabCount > 1 && (
          <TabsList className="mb-6 flex w-fit max-w-full justify-start gap-2 overflow-x-auto rounded-none border-b bg-transparent p-0">
            {hasDescriptionTab && (
              <TabsTrigger
                value="description"
                className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold tracking-wide uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
            )}
            {!!product.youtubeVideoUrl && (
              <TabsTrigger
                value="video"
                className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold tracking-wide uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Product Video
              </TabsTrigger>
            )}
            {hasRefundPolicy && (
              <TabsTrigger
                value="refund"
                className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold tracking-wide uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Refund Policy
              </TabsTrigger>
            )}
            {hasReturnPolicy && (
              <TabsTrigger
                value="return"
                className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold tracking-wide uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
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
            <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl">
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
