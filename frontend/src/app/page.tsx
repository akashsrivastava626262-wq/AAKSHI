import Hero from '@/components/home/Hero';
import { TrustBadges } from '@/components/home/WhyChooseUs';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import { BestSellers, NewArrivals, TrendingEarrings, TrendingNecklaces } from '@/components/home/ProductSections';
import { KoreanCollection, AntiTarnishCollection } from '@/components/home/CollectionBanners';
import CustomerReviews from '@/components/home/CustomerReviews';
import InstagramFeed from '@/components/home/InstagramFeed';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import BrandStory from '@/components/home/BrandStory';
import ExclusiveOffers from '@/components/home/ExclusiveOffers';
import Newsletter from '@/components/home/Newsletter';
import FAQ from '@/components/home/FAQ';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedCollections />
      <BestSellers />
      <NewArrivals />
      <KoreanCollection />
      <AntiTarnishCollection />
      <TrendingEarrings />
      <TrendingNecklaces />
      <CustomerReviews />
      <InstagramFeed />
      <WhyChooseUs />
      <BrandStory />
      <ExclusiveOffers />
      <Newsletter />
      <FAQ />
    </>
  );
}
