import type { Metadata } from "next";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Services | Jolomi Dudu",
  description: "Web, mobile, design, analytics and growth services for ambitious businesses.",
};

const services = [
  { number: "01", title: "Websites & web apps", description: "Fast, conversion-focused websites and custom web apps that make your business easier to trust and easier to use.", price: "From ₦450,000" },
  { number: "02", title: "Mobile app development", description: "Cross-platform mobile products for teams that need a thoughtful MVP or a reliable app their customers return to.", price: "From ₦750,000" },
  { number: "03", title: "UI/UX design", description: "Clear user flows, wireframes and polished interfaces that turn a complicated product into a simple experience.", price: "From ₦250,000" },
  { number: "04", title: "Data analytics", description: "Dashboards, reporting and analysis that help you understand what is happening and decide what to do next.", price: "From ₦200,000" },
  { number: "05", title: "Consultancy & business development", description: "Practical product, technology and growth guidance for founders and teams making important decisions.", price: "From ₦75,000 / session" },
  { number: "06", title: "Maintenance & social media", description: "Ongoing technical care, content systems and social media support that keep your digital presence active.", price: "From ₦100,000 / month" },
];

export default function ServicesPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      <section className="px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28 lg:px-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Services & pricing</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Useful digital work, priced with clarity.</h1>
          <p className="max-w-md text-lg leading-8 text-black/60">Choose a starting point below. Every project begins with a short discovery call, a written scope and a payment plan that makes sense for the work.</p>
        </div>
      </section>

      <section className="bg-[#111111] px-6 py-20 text-[#f5f5f0] md:px-12 md:py-28 lg:px-16">
        <div className="divide-y divide-white/15 border-y border-white/15">
          {services.map((service) => (
            <article key={service.number} className="grid gap-6 py-8 md:grid-cols-[80px_1fr_190px] md:items-start md:py-10">
              <span className="text-sm text-white/35">{service.number}</span>
              <div><h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{service.title}</h2><p className="mt-4 max-w-2xl leading-7 text-white/55">{service.description}</p></div>
              <p className="text-sm font-semibold text-[#5ed4c7] md:text-right">{service.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="booking" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Start here</p><h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">Let&apos;s scope the right next move.</h2></div>
          <div className="border-t border-black/15 pt-6"><p className="max-w-md leading-7 text-black/60">For now, payments are completed by invoice after your scope is approved. Paystack and Flutterwave checkout can be connected once your business keys and preferred currency are configured.</p><a href="mailto:jollofdudu@gmail.com?subject=Project%20enquiry" className="mt-8 inline-flex rounded-full bg-[#00A9A5] px-6 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-1">Request a quote ↗</a></div>
        </div>
      </section>
      </main>
    </SiteChrome>
  );
}
