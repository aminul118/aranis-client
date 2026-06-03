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

  const hasDescText = stripHtml(product.description).length > 0;

  const hasDetailsText =
    !!product.details &&
    (Array.isArray(product.details)
      ? product.details.some((d) => stripHtml(d).length > 0)
      : stripHtml(product.details).length > 0);

  const hasDescriptionTab = hasDescText || hasDetailsText;

  return (
    <div className="border-border/50 space-y-10 border-t pt-8">
      <Tabs
        defaultValue={hasDescriptionTab ? 'description' : 'refund'}
        className="w-full"
      >
        <TabsList className="mb-8 flex w-full justify-start gap-4 overflow-x-auto rounded-none border-b bg-transparent p-0">
          {hasDescriptionTab && (
            <TabsTrigger
              value="description"
              className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Description
            </TabsTrigger>
          )}
          {product.videoUrl && (
            <TabsTrigger
              value="video"
              className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Product Video
            </TabsTrigger>
          )}
          <TabsTrigger
            value="refund"
            className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Refund Policy
          </TabsTrigger>
          <TabsTrigger
            value="return"
            className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Return Policy
          </TabsTrigger>
        </TabsList>

        {hasDescriptionTab && (
          <TabsContent value="description" className="mt-0">
            <div className="space-y-8">
              {hasDescText && (
                <div>
                  <HtmlContent
                    content={product.description}
                    className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                  />
                </div>
              )}

              {/* Mobile Artisanal Details */}
              {hasDetailsText && (
                <div className="lg:hidden">
                  <h2 className="text-foreground mb-4 text-xs font-black tracking-[0.2em] uppercase">
                    Artisanal Details
                  </h2>
                  <HtmlContent
                    content={
                      Array.isArray(product.details)
                        ? product.details.join('\n')
                        : product.details
                    }
                    className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none leading-relaxed font-medium"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {product.videoUrl && (
          <TabsContent value="video" className="mt-0">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(product.videoUrl)}
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

        <TabsContent value="refund" className="mt-0">
          <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
            {settings?.refundPolicy ? (
              <HtmlContent content={settings.refundPolicy} />
            ) : (
              <>
                <p>
                  We believe in the quality of our products. If you are not
                  completely satisfied with your purchase, we offer a
                  straightforward refund policy.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>Refunds must be requested within 30 days of delivery.</li>
                  <li>
                    The item must be in its original condition, unworn,
                    unwashed, with all original tags attached.
                  </li>
                  <li>
                    Refunds will be processed to the original payment method
                    within 5-7 business days after we receive the returned item.
                  </li>
                  <li>
                    Shipping costs are non-refundable unless the item received
                    was damaged or incorrect.
                  </li>
                </ul>
                <p className="mt-4">
                  Please contact our support team at support@aranis.com to
                  initiate a refund request.
                </p>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="return" className="mt-0">
          <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
            {settings?.returnPolicy ? (
              <HtmlContent content={settings.returnPolicy} />
            ) : (
              <>
                <p>
                  Our return process is designed to be as seamless as possible
                  for you.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>
                    You have 30 days from the date of delivery to return your
                    item.
                  </li>
                  <li>
                    To initiate a return, please log in to your account,
                    navigate to "My Orders," and select the item you wish to
                    return.
                  </li>
                  <li>
                    You will receive a pre-paid return shipping label via email.
                  </li>
                  <li>
                    Please package the item securely and drop it off at any
                    authorized shipping location.
                  </li>
                </ul>
                <p className="mt-4">
                  Once your return is received and inspected, we will notify you
                  of the approval or rejection of your return. Approved returns
                  will be refunded or exchanged according to your preference.
                </p>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailTabs;
