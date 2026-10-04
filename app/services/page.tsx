import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../site-chrome";
import PaymentForm from "./payment-form";
import { projectServices } from "../projects/project-services";
import ServicePrice from "../projects/service-price";

export const metadata: Metadata = {
  title: "CATALOG",
  description: "Technology strategy, software development, design, analytics, and leadership services.",
};

export default function ServicesPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      <section className="px-5 pb-16 pt-10 md:px-12 md:pb-24 md:pt-14 lg:px-16">
        <p className="mb-6 text-center text-[1.25rem] font-bold uppercase tracking-[0.2em] text-[#751a1a]">Services & pricing</p>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {projectServices.map((service) => (
            <article key={service.id} className="flex min-h-48 flex-col rounded-lg border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:min-h-52 sm:p-6">
              <span className="text-xs font-medium text-black/45">{service.number}</span>
              <h2 className="mt-4 text-lg font-bold leading-tight tracking-tight text-[#222222] sm:text-2xl">{service.name}</h2>
              <div className="mt-3 text-md font-semibold text-[#343434] sm:text-base">
                <ServicePrice nigeria={service.nigeria} international={service.international} />
              </div>
              <Link href={`/services/${service.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-xs font-semibold text-[#343434] transition-colors hover:bg-[#E8DCC8] sm:text-sm">
                <span>HAVE A LOOK</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        
      </section>

      

      <section id="booking" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
     
          <div className="border-t border-black/15 pt-6"><p className="max-w-md leading-7 text-black/60"></p><PaymentForm services={projectServices.map(({ slug, name, startingAmount }) => ({ id: slug, title: name, startingAmount }))} /></div>
        </div>
      </section>
      </main>
    </SiteChrome>
  );
}
