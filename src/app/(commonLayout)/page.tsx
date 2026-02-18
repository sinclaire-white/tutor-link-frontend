import { BecomeTutorCTA } from "@/components/home-page-sections/BecomeTutorCTA";
import { Categories } from "@/components/home-page-sections/Categories";
import { FAQ } from "@/components/home-page-sections/FAQ";
import { FeaturedTutors } from "@/components/home-page-sections/FeaturedTutors";
import { HeroBanner } from "@/components/home-page-sections/HeroBanner";
import { HowItWorks } from "@/components/home-page-sections/HowItWorks";
import { NewsLetter } from "@/components/home-page-sections/NewsLetter";
import { Stats } from "@/components/home-page-sections/Stats";
import { Testimonials } from "@/components/home-page-sections/Testimonials";
import { WhyTutorLink } from "@/components/home-page-sections/WhyTutorLink";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <HowItWorks />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <WhyTutorLink />
        </div>
        
        <div className="bg-muted/30 w-full py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Categories />
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <FeaturedTutors />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 md:py-12">
          <BecomeTutorCTA />
        </div>
        
        <Stats />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <Testimonials />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <FAQ />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 md:py-12">
          <NewsLetter />
        </div>
      </div>
    </div>
  );
}
