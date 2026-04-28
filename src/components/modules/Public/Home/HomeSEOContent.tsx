import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';

const HomeSEOContent = () => {
  const sections = [
    {
      title: "Best Women's Wear in Bangladesh",
      slug: 'Women',
      content:
        "The Aranis is the most popular Women's Brand Shop in BD. Whether you are a professional, a student, or a fashion enthusiast, Aranis has the perfect attire for you. Our collection of Ethnic Wear and Contemporary Western Wear is loved by all because we always bring the latest trends in Bangladesh. As the best women's fashion shop in BD, we prioritize your style and comfort. We bring the latest designer Salwar Kameez, Kurtis, and Sarees under budget for every customer - from daily wear to festive expert choices. Aranis is considered the most trusted women's wear shop in BD, allowing you to buy the best apparel from top local and international styles. Along with the best brands, our stylists provide you with the best fashion decisions based on your needs and budget.",
      badge: 'Women',
    },
    {
      title: "Best Men's Fashion Collection in Bangladesh",
      slug: 'Men',
      content:
        "Aranis has the most comprehensive array of Men's Fashion. We offer top-of-the-line Suits, Blazers, Panjabis, and Casual Wear at Aranis outlets, the trusted and most popular Men's shop in Bangladesh. Get your new formal attire or weekend casuals with a focus on premium fabric and perfect fit. You can always depend on Aranis's fashion experts to curate the best wardrobe with pieces of your choice. Aranis is Bangladesh's most reliable destination for premium men's tailoring and ready-to-wear essentials. Take your professional or social presence to the next level with a large collection of high-end Formal Wear and Streetwear from Aranis.",
      badge: 'Men',
    },
    {
      title: 'Best Activewear Shop In Bangladesh',
      slug: 'Activewear',
      content:
        "We at Aranis love an active lifestyle. Therefore, we aim to provide a holistic fitness experience with our specialized activewear line, 'Aranis Active.' This specialized collection is designed with high-performance fabrics for gym, yoga, or outdoor sports. Our activewear shop in Bangladesh offers the broadest range of breathable leggings, moisture-wicking tees, and comfortable hoodies. Aranis's largest activewear collection consists of sports bras, tracksuits, athletic socks, and high-performance base layers. We ensure you have the best gear from world-renowned athletic standards, tailoring our products for maximum durability and style.",
      badge: 'Active',
    },
    {
      title: 'Best Occasion Wear Shop In Bangladesh',
      slug: 'Ethnic Wear',
      content:
        "The Aranis is Bangladesh's most trusted Occasion Wear Shop. For years, we have been providing the best stylistic solutions for weddings, parties, and corporate events. Furnish your wardrobe with the best festive supplies. Find Wedding Lehengas, Reception Gowns, Evening Dresses, and Festive Panjabis for a smooth and stunning presence. Our expert designers meticulously craft each piece to ensure it meets the highest standards of elegance and sophistication.",
      badge: 'Occasion',
    },
    {
      title: 'Largest Fashion Accessories Shop In Bangladesh',
      slug: 'Accessories',
      content:
        'We bring in the most sought-after accessories at Aranis. Only genuine and leading styles of Handbags, Jewelry, Belts, and Watches are available at our Accessory Shop. We are also concerned for creative professionals for whom we bring exciting statement pieces like Handcrafted Jewelry, Silk Scarves, and Premium Leather Belts from reputed artisans. Aranis has established the largest fashion accessory shop in BD with the help of our mobile app and E-commerce website. Ease up your styling choices with daily lifestyle accessories from our shop, covering a wide range of contemporary and traditional designs.',
      badge: 'Accessories',
    },
    {
      title: 'Top Footwear & Trend Collection',
      slug: 'Footwear',
      content:
        'Offering extensive variety, comfort-focused designs, and home delivery service spanning the country, we are the top fashion destination in Bangladesh. Our footwear and trend collections are optimized for the modern user, allowing you to browse thousands of styles with ease. Aranis is a one-stop solution for high-quality fashion in Bangladesh, providing an integrated experience across our app and E-commerce website.',
      badge: 'Footwear',
    },
  ];

  const highlights = [
    'Latest trends in Bangladesh',
    'Premium fabrics & perfect fit',
    'Daily wear to festive collections',
    'Accessories + footwear in one place',
    'Nationwide delivery across 64 districts',
  ];

  // FAQ Schema for Search Engines
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sections.slice(0, 4).map((s) => ({
      '@type': 'Question',
      name: `Where can I find the ${s.title}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: s.content,
      },
    })),
  };

  return (
    <section
      aria-labelledby="home-seo-title"
      className="relative overflow-hidden border-t border-white/5 py-24 md:py-32"
    >
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header - Storytelling Intro */}
        <header className="mb-24 flex flex-col items-center text-center md:mb-32">
          <span className="text-primary mb-6 flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
            Story of Aranis
          </span>

          <h2
            id="home-seo-title"
            className="text-foreground max-w-4xl text-4xl leading-[1.1] font-extrabold tracking-tight text-pretty md:text-6xl"
          >
            Aranis Fashion: Leading Premium Apparel & Online Fashion Shop in
            Bangladesh
          </h2>

          <div className="text-muted-foreground mt-10 max-w-3xl space-y-6 text-lg leading-relaxed md:text-xl">
            <p>
              Fashion has become an essential part of our daily identity, and we
              depend on quality apparel to express ourselves in every portion of
              our lives. There is hardly a wardrobe in Bangladesh without a
              touch of premium fashion.
            </p>
            <p>
              This is where we come in. Starting as a boutique design house, The
              Aranis focuses on giving the best customer experience in
              Bangladesh, following our motto:{' '}
              <span className="text-foreground font-bold italic">
                “Customer Comes First.”
              </span>
            </p>
          </div>

          <div className="mt-14 grid w-full place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {highlights.map((h) => (
              <div
                key={h}
                className="group relative flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/5"
              >
                <div className="bg-primary/20 grid h-6 w-6 place-items-center rounded-full">
                  <Check className="text-primary h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <p className="text-foreground/80 text-left text-sm leading-tight font-semibold">
                  {h}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* Vertical Editorial Sections */}
        <div className="space-y-32 md:space-y-48">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className={cn(
                'group relative flex flex-col gap-10 md:gap-20',
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
              )}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase">
                    {section.badge}
                  </span>
                  <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                </div>

                <h3 className="text-foreground text-3xl font-extrabold tracking-tight md:text-5xl">
                  {section.title}
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
                  {section.content}
                </p>

                <div className="pt-4">
                  <Link
                    href={`/shop?category=${section.slug}`}
                    className="group/btn text-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase"
                  >
                    Browse Collections
                    <span className="h-0.5 w-8 origin-left bg-blue-500 transition-all group-hover/btn:w-12" />
                  </Link>
                </div>
              </div>

              {/* Decorative side element */}
              <div className="bg-primary/5 relative grid h-[300px] flex-1 place-items-center overflow-hidden rounded-[48px] border border-white/5 opacity-50 backdrop-blur-3xl md:h-[400px]">
                <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent" />
                <span className="text-9xl font-black text-white/5 italic select-none">
                  {section.badge.charAt(0)}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Global Standards & Distribution Section */}
        <footer className="mt-32 md:mt-48">
          <div className="relative overflow-hidden rounded-[64px] border border-white/10 bg-white/2 p-8 shadow-2xl backdrop-blur-md md:p-20">
            <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:gap-24">
              <div className="space-y-8">
                <h3 className="text-foreground text-3xl font-extrabold md:text-4xl">
                  Trusted Online Fashion Shopping at The Best E-Commerce Website
                </h3>
                <div className="text-muted-foreground space-y-6 text-lg leading-relaxed">
                  <p>
                    Aranis believes intensely in customer satisfaction. To meet
                    the surging demand for{' '}
                    <Link
                      href="/shop"
                      className="text-primary font-bold hover:underline"
                    >
                      online fashion shopping in Bangladesh
                    </Link>
                    , we launched our highly trusted E-Commerce platform.
                  </p>
                  <p>
                    Aranis is revolutionizing online shopping in Bangladesh,
                    featuring a brilliant search engine that helps our valued
                    customers find their desired styles easily. Our platform
                    runs a variety of campaigns and exciting deals, bringing
                    global fashion to your doorstep.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-foreground text-3xl font-extrabold md:text-4xl">
                  Best Price, Custom Service, & Fastest Delivery
                </h3>
                <div className="text-muted-foreground space-y-6 text-lg leading-relaxed">
                  <p>
                    The Aranis has taken care of its customers since the
                    beginning. We deliver the best products for the best price
                    with extended after-sales support and the highest standard
                    of customer service.
                  </p>
                  <p>
                    With our nationwide presence, we cover all 64 districts of
                    Bangladesh. Our distribution hubs and dedicated service
                    centers ensure that global standards are maintained in every
                    delivery, making{' '}
                    <Link
                      href="/shop"
                      className="text-primary font-bold hover:underline"
                    >
                      premium fashion
                    </Link>{' '}
                    accessible to everyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center gap-6 border-t border-white/5 pt-12 text-center md:flex-row md:justify-between md:text-left">
              <p className="text-muted-foreground max-w-md text-sm">
                As an organization strictly maintaining regulatory requirements,
                Aranis is committed to providing products and services of a
                global standard.
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-foreground text-sm font-black tracking-widest uppercase">
                  The Aranis • Bangladesh
                </p>
                <div className="flex justify-center gap-4 md:justify-end">
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                  <div className="bg-primary/50 h-1.5 w-1.5 rounded-full" />
                  <div className="bg-primary/20 h-1.5 w-1.5 rounded-full" />
                </div>
              </div>
            </div>

            {/* Corner glow */}
            <div className="bg-primary/10 absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full blur-[120px]" />
          </div>
        </footer>
      </div>

      {/* Global background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]" />
    </section>
  );
};

export default HomeSEOContent;
