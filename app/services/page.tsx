import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../site-chrome";
import PaymentForm from "./payment-form";
import { projectServices } from "../projects/project-services";

export const metadata: Metadata = {
  title: "Services | Jolomi Dudu",
  description: "Technology strategy, software development, design, analytics, and leadership services.",
};

export default function ServicesPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      <section className="px-5 pb-16 pt-10 md:px-12 md:pb-24 md:pt-14 lg:px-16">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Services & pricing</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {projectServices.map((service) => (
            <article key={service.id} className="flex min-h-48 flex-col border border-black/10 bg-white/70 p-4 sm:min-h-52 sm:p-6">
              <span className="text-xs font-medium text-black/40">{service.number}</span>
              <h2 className="mt-4 text-lg font-semibold leading-tight tracking-tight sm:text-2xl">{service.name}</h2>
              <div className="mt-3 space-y-1 text-sm font-semibold text-[#008c87] sm:text-base">
                <p>Nigeria: {service.nigeria}</p>
                <p>International: {service.international}</p>
              </div>
              <Link href={`/services/${service.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 border border-black/20 px-3 py-2 text-xs font-semibold transition-colors hover:border-[#008c87] hover:text-[#008c87] sm:text-sm">
                View service <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      

      <section id="booking" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Start here</p><h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">Let&apos;s scope the right next move.</h2></div>
          <div className="border-t border-black/15 pt-6"><p className="max-w-md leading-7 text-black/60">Pay a service deposit based on 25% of its Nigeria starting price, or enter a custom naira amount. Checkout is handled securely by Paystack.</p><PaymentForm services={projectServices.map(({ slug, name, startingAmount }) => ({ id: slug, title: name, startingAmount }))} /></div>
        </div>
      </section>
      </main>
    </SiteChrome>
  );
}
