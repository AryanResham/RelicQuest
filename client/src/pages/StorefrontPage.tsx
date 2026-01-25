import { Header, Footer } from "@/components/layout";

import Hero from "@/components/storeFront/Hero";
import TrustIndicators from "@/components/storeFront/TrustIndicators";
import LiveAuctions from "@/components/storeFront/LiveAuctions";
import FeaturedAuctions from "@/components/storeFront/FeaturedAuctions";
import Categories from "@/components/storeFront/Categories";
import Newsletter from "@/components/storeFront/Newsletter";

function StorefrontPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <Header />
      <div className="flex flex-col flex-1 w-full mx-auto max-w-[1440px]">
        <Hero />
        <TrustIndicators />
        <FeaturedAuctions />
        <Categories />
        <LiveAuctions />
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}

export default StorefrontPage;
