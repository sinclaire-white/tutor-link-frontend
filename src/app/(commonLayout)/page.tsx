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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       <HeroBanner />
       <section className="py-4 md:py-8 lg:py-12">
        <HowItWorks />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <WhyTutorLink />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <Categories />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <FeaturedTutors />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <BecomeTutorCTA />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <Stats />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <Testimonials />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <FAQ />
       </section>
       <section className="mb-4 md:mb-8 lg:mb-12">
        <NewsLetter />
       </section>
      </main>
    </div>
  );
}
