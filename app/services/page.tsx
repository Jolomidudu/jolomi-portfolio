import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../site-chrome";
import PaymentForm from "./payment-form";
import { projectServices } from "../projects/project-services";
import ServicePrice from "../projects/service-price";

export const metadata: Metadata = {
  title: "Services | Jolomi Dudu",
  description: "Technology strategy, software development, design, analytics, and leadership services.",
};

export default function ServicesPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      <section className="px-5 pb-16 pt-10 md:px-12 md:pb-24 md:pt-14 lg:px-16">
        <p className="mb-6 text-center text-[1.05rem] font-bold uppercase tracking-[0.2em] text-[#00A9A5]">Services & pricing</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {projectServices.map((service) => (
            <article key={service.id} className="flex min-h-48 flex-col border border-white/10 bg-[#343434] p-4 sm:min-h-52 sm:p-6">
              <span className="text-xs font-medium text-white/50">{service.number}</span>
              <h2 className="mt-4 text-lg font-bold leading-tight tracking-tight text-white sm:text-2xl">{service.name}</h2>
              <div className="mt-3 text-md font-semibold text-[#E8DCC8] sm:text-base">
                <ServicePrice nigeria={service.nigeria} international={service.international} />
              </div>
              <Link href={`/services/${service.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 bg-white px-3 py-2 text-xs font-semibold text-[#343434] transition-colors hover:bg-[#E8DCC8] sm:text-sm">
                VIEW IN <span aria-hidden="true">↗</span>
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
