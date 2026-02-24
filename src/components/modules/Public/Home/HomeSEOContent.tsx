import { cn } from '@/lib/utils';

const HomeSEOContent = () => {
  const sections = [
    {
      title: "Best Women's Wear in Bangladesh",
      content:
        "Lumiere Fashion is the most popular Women's Brand Shop in BD. Whether you are a professional, a student, or a fashion enthusiast, Lumiere has the perfect attire for you. Our collection of Ethnic Wear and Contemporary Western Wear is loved by all because we always bring the latest trends in Bangladesh. As the best women's fashion shop in BD, we prioritize your style and comfort. We bring the latest designer Salwar Kameez, Kurtis, and Sarees under budget for every customer - from daily wear to festive expert choices. Lumiere is considered the most trusted women's wear shop in BD, allowing you to buy the best apparel from top local and international styles. Along with the best brands, our stylists provide you with the best fashion decisions based on your needs and budget.",
      badge: 'Women',
    },
    {
      title: "Best Men's Fashion Collection in Bangladesh",
      content:
        "Lumiere has the most comprehensive array of Men's Fashion. We offer top-of-the-line Suits, Blazers, Panjabis, and Casual Wear at Lumiere outlets, the trusted and most popular Men's shop in Bangladesh. Get your new formal attire or weekend casuals with a focus on premium fabric and perfect fit. You can always depend on Lumiere's fashion experts to curate the best wardrobe with pieces of your choice. Lumiere is Bangladesh's most reliable destination for premium men's tailoring and ready-to-wear essentials. Take your professional or social presence to the next level with a large collection of high-end Formal Wear and Streetwear from Lumiere.",
      badge: 'Men',
    },
    {
      title: 'Best Activewear Shop In Bangladesh',
      content:
        "We at Lumiere love an active lifestyle. Therefore, we aim to provide a holistic fitness experience with our specialized activewear line, 'Lumiere Active.' This specialized collection is designed with high-performance fabrics for gym, yoga, or outdoor sports. Our activewear shop in Bangladesh offers the broadest range of breathable leggings, moisture-wicking tees, and comfortable hoodies. Lumiere's largest activewear collection consists of sports bras, tracksuits, athletic socks, and high-performance base layers. We ensure you have the best gear from world-renowned athletic standards, tailoring our products for maximum durability and style.",
      badge: 'Active',
    },
    {
      title: 'Best Occasion Wear Shop In Bangladesh',
      content:
        "Lumiere Fashion is Bangladesh's most trusted Occasion Wear Shop. For years, we have been providing the best stylistic solutions for weddings, parties, and corporate events. Furnish your wardrobe with the best festive supplies. Find Wedding Lehengas, Reception Gowns, Evening Dresses, and Festive Panjabis for a smooth and stunning presence. Our expert designers meticulously craft each piece to ensure it meets the highest standards of elegance and sophistication.",
      badge: 'Occasion',
    },
    {
      title: 'Largest Fashion Accessories Shop In Bangladesh',
      content:
        'We bring in the most sought-after accessories at Lumiere. Only genuine and leading styles of Handbags, Jewelry, Belts, and Watches are available at our Accessory Shop. We are also concerned for creative professionals for whom we bring exciting statement pieces like Handcrafted Jewelry, Silk Scarves, and Premium Leather Belts from reputed artisans. Lumiere has established the largest fashion accessory shop in BD with the help of our mobile app and E-commerce website. Ease up your styling choices with daily lifestyle accessories from our shop, covering a wide range of contemporary and traditional designs.',
      badge: 'Accessories',
    },
    {
      title: 'Top Footwear & Trend Collection',
      content:
        'Offering extensive variety, comfort-focused designs, and home delivery service spanning the country, we are the top fashion destination in Bangladesh. Our footwear and trend collections are optimized for the modern user, allowing you to browse thousands of styles with ease. Lumiere is a one-stop solution for high-quality fashion in Bangladesh, providing an integrated experience across our app and E-commerce website.',
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

  return (
    <section
      aria-labelledby="home-seo-title"
      className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-14 md:mb-20">
          <p className="text-muted-foreground mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold tracking-widest">
            PREMIUM FASHION • BANGLADESH
          </p>

          <h2
            id="home-seo-title"
            className="text-foreground text-3xl font-extrabold tracking-tight text-balance md:text-5xl"
          >
            Lumiere Fashion: Leading Premium Apparel & Online Fashion Shop in
            Bangladesh
          </h2>

          <div className="text-muted-foreground mt-6 max-w-3xl space-y-5 text-base leading-relaxed md:text-lg">
            <p>
              Fashion has become an essential part of our daily identity, and we
              depend on quality apparel to express ourselves in every portion of
              our lives. There is hardly a wardrobe in Bangladesh without a
              touch of premium fashion. This is where we come in. Lumiere
              Fashion started as a boutique design house, focusing on giving the
              best customer experience in Bangladesh, following our motto of
              “Customer Comes First.”
            </p>
            <p>
              This is why Lumiere is the most trusted fashion house in
              Bangladesh today, capturing the loyalty of a large customer base.
              Lumiere was recognized for its Quality Control Management System,
              strictly maintaining all sorts of regulatory requirements to
              provide customers with clothing and services of a global standard.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-10 grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2 md:p-6">
            {highlights.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <span className="bg-primary/80 mt-1 inline-block h-2 w-2 rounded-full" />
                <p className="text-foreground/90 text-sm font-medium md:text-base">
                  {h}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* Content blocks */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className={cn(
                'group relative rounded-[32px] border border-white/10 bg-white/[0.03] p-6',
                'shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl',
                'transition-transform duration-300 hover:-translate-y-0.5',
              )}
            >
              {/* Badge */}
              <div className="text-muted-foreground mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold">
                <span className="bg-primary/80 h-1.5 w-1.5 rounded-full" />
                {section.badge}
              </div>

              <h3 className="text-foreground text-xl font-bold tracking-tight text-pretty md:text-2xl">
                {section.title}
              </h3>

              <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
                {section.content}
              </p>

              {/* subtle corner glow */}
              <div className="bg-primary/10 pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-100" />
            </article>
          ))}
        </div>

        {/* Trust + Logistics */}
        <footer className="mt-12 md:mt-16">
          <div className="grid gap-6 rounded-[40px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl md:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="text-foreground text-xl font-bold md:text-2xl">
                  Trusted Online Fashion Shopping at The Best E-Commerce Website
                </h3>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
                  Lumiere believes the most in customer satisfaction. To meet
                  the surging demand for online fashion shopping in Bangladesh,
                  we launched our highly trusted E-Commerce website. Lumiere is
                  revolutionizing online shopping in Bangladesh, featuring a
                  brilliant search engine that helps our valued customers find
                  their desired styles easily. Our platform runs a variety of
                  campaigns and exciting deals, bringing global fashion to your
                  doorstep.
                </p>
              </div>

              <div>
                <h3 className="text-foreground text-xl font-bold md:text-2xl">
                  Best Price, Custom Service, & Fastest Delivery
                </h3>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
                  Lumiere Fashion has taken care of its customers since the
                  beginning. We deliver the best products for the best price
                  with extended after-sales support and the highest standard of
                  customer service. With our nationwide presence, we cover all
                  64 districts of Bangladesh. Our distribution hubs and
                  dedicated service centers ensure that global standards are
                  maintained in every delivery.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-muted-foreground text-sm">
                Shop premium fashion with confidence — quality, fit, and fast
                delivery.
              </p>
              <p className="text-foreground text-sm font-semibold">
                Lumiere Fashion • Online & Retail
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <div className="absolute top-0 -left-1/4 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>
    </section>
  );
};

export default HomeSEOContent;
