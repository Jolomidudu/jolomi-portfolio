import type { Metadata } from "next";
import SiteChrome from "../site-chrome";
import PaymentForm from "./payment-form";

export const metadata: Metadata = {
  title: "Services | Jolomi Dudu",
  description: "Web, mobile, design, analytics and growth services for ambitious businesses.",
};

const services = [
  { id: "web", number: "01", title: "Websites & web apps", description: "Fast, conversion-focused websites and custom web apps that make your business easier to trust and easier to use.", price: "From ₦650,000", amount: 650000 },
  { id: "mobile", number: "02", title: "Mobile app development", description: "Cross-platform mobile products for teams that need a thoughtful MVP or a reliable app their customers return to.", price: "From ₦1,500,000", amount: 1500000 },
  { id: "design", number: "03", title: "UI/UX design", description: "Clear user flows, wireframes and polished interfaces that turn a complicated product into a simple experience.", price: "From ₦350,000", amount: 350000 },
  { id: "analytics", number: "04", title: "Data analytics", description: "Dashboards, reporting and analysis that help you understand what is happening and decide what to do next.", price: "From ₦400,000", amount: 400000 },
  { id: "consultancy", number: "05", title: "Consultancy & business development", description: "Practical product, technology and growth guidance for founders and teams making important decisions.", price: "From ₦150,000 / session", amount: 150000 },
  { id: "maintenance", number: "06", title: "Maintenance & social media", description: "Ongoing technical care, content systems and social media support that keep your digital presence active.", price: "From ₦300,000 / month", amount: 300000 },
];

export default function ServicesPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      <section className="px-5 pb-16 pt-10 md:px-12 md:pb-24 md:pt-14 lg:px-16">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Services & pricing</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.number} className="flex min-h-52 flex-col border border-black/10 bg-white/70 p-4 sm:min-h-60 sm:p-6">
              <span className="text-xs font-medium text-black/40">{service.number}</span>
              <h2 className="mt-4 text-lg font-semibold leading-tight tracking-tight sm:text-2xl">{service.title}</h2>
              <p className="mt-3 text-sm leading-5 text-black/60 sm:leading-6">{service.description}</p>
              <p className="mt-auto pt-5 text-sm font-semibold text-[#008c87] sm:text-base">{service.price}</p>
            </article>
          ))}
        </div>
      </section>

      

      <section id="booking" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Start here</p><h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">Let&apos;s scope the right next move.</h2></div>
          <div className="border-t border-black/15 pt-6"><p className="max-w-md leading-7 text-black/60">Choose a starting package and pay securely with Paystack. The payment is a project deposit; final scope and milestones are confirmed with you before work begins.</p><PaymentForm services={services.map(({ id, title, amount }) => ({ id, title, amount, note: "" }))} /></div>
        </div>
      </section>
      </main>
    </SiteChrome>
  );
}
