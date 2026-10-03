import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "../../site-chrome";
import { projectServices } from "../../projects/project-services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

function findService(slug: string) {
  return projectServices.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return projectServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) notFound();

  return {
    title: `${service.name} | Jolomi Dudu`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) notFound();

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        <section className="px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-20 lg:px-16">
          <Link href="/services" className="text-sm font-medium text-black/55 transition-colors hover:text-[#008c87]">← All services</Link>
          <div className="mt-12 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">Service {service.number}</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">{service.name}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-black/60">{service.description}</p>
            <dl className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-[#00A9A5] pl-4">
                <dt className="text-sm font-medium text-black/50">Nigeria</dt>
                <dd className="mt-1 text-lg font-semibold text-[#008c87]">{service.nigeria}</dd>
              </div>
              <div className="border-l-2 border-[#00A9A5] pl-4">
                <dt className="text-sm font-medium text-black/50">International</dt>
                <dd className="mt-1 text-lg font-semibold text-[#008c87]">{service.international}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-black/10 px-6 py-16 md:px-12 md:py-20 lg:px-16">
          <div className="grid gap-12 md:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">What it can include</p>
              <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="py-5 text-lg leading-7">{deliverable}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-between gap-8 border-t border-black/15 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <h2 className="text-2xl font-semibold">A clear scope, built around your goals.</h2>
                <p className="mt-4 leading-7 text-black/60">Every engagement starts with a conversation to confirm what you need, what is included and the right timeline.</p>
              </div>
              <a href="https://calendly.com/jollofdudu/let-s-discuss-your-project" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]">
                Discuss this service <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
