import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronsRight } from "lucide-react";
import SiteChrome from "../site-chrome";
import PaymentForm from "./payment-form";
import { projectServices } from "../projects/project-services";
import ServicePrice from "../projects/service-price";

export const metadata: Metadata = {
  title: "Services",
  description: "Technology strategy, software development, design, analytics, and leadership services.",
};



export default function ServicesPage() {
  const serviceCount: number = projectServices.length;

  return (
    <SiteChrome headerMode="services" projectRequestLauncher="circular">
      <main className="min-h-screen bg-[#858585] text-[#111111]">

      <section
        className="relative flex min-h-[34.59375svh] flex-col justify-end px-5 pb-16 pt-32 text-white sm:min-h-[34.59375svh] md:px-12 md:pb-24 md:pt-40 lg:px-16"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(13, 25, 25, 0.82), rgba(13, 25, 25, 0.34)), url('/office.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="max-w-4xl">
         
          <h1 className="text-3xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-[36px] md:text-[48px] lg:text-[57.6px]">
            Services &amp; Fees
          </h1>
          
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[10%] bg-[#858585] sm:hidden" />
      </section>



      <section className="px-8 pb-[50px] pt-10 md:px-12 md:pb-[50px] md:pt-14 lg:px-16">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-md font-semibold text-[#ffffff]">
            {serviceCount} Service {serviceCount === 1 ? "Offering" : "Offerings"}
          </p>
          <p className="flex items-center gap-1 text-xs font-medium text-white/60 sm:hidden">
            Scroll to pick a service
            <ChevronsRight aria-hidden="true" className="h-4 w-4" />
          </p>
        </div>

        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {projectServices.map((service) => (
            <article key={service.id} className="flex min-h-48 w-[82vw] shrink-0 snap-start flex-col rounded-lg border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:min-h-52 sm:w-auto sm:min-w-0 sm:shrink sm:snap-none sm:p-6">
              <span className="text-xs font-medium text-brown/85">{service.number}</span>
              <h2 className="mt-4 text-lg font-bold leading-tight tracking-tight text-[#222222] sm:text-2xl">{service.name}</h2>
              <div className="mt-3 text-md font-semibold text-[#39b400] sm:text-base">
                <ServicePrice nigeria={service.nigeria} international={service.international} />
              </div>
              <Link href={`/services/${service.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-[#343434] px-3 py-2 text-xs font-semibold text-[#ffffff] transition-colors hover:bg-[#E8DCC8] sm:text-sm">
                <span>HAVE A LOOK</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        
        
      </section>

      

      <PaymentForm services={projectServices.map(({ slug, name, startingAmount }) => ({ id: slug, title: name, startingAmount }))} />
      </main>
    </SiteChrome>
  );
}
