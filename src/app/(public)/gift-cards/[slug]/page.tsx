import { getSingleGiftCard } from '@/services/giftcard/giftcard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GiftCardDetail from './_components/GiftCardDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getSingleGiftCard(slug);
    if (!data) return { title: 'Not Found' };

    return {
      title: `${data.name} | Aranis Gift Cards`,
      description: data.description,
    };
  } catch (error) {
    return {
      title: 'Not Found',
    };
  }
}

export default async function GiftCardDetailsPage({ params }: Props) {
  const { slug } = await params;
  let giftCard = null;

  try {
    const { data } = await getSingleGiftCard(slug);
    giftCard = data;
  } catch (error) {
    // handled below
  }

  if (!giftCard || giftCard.isDeleted) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-6xl px-4">
        <GiftCardDetail giftCard={giftCard} />
      </div>
    </div>
  );
}
