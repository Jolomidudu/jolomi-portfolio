
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import SiteChrome from "../site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy | Jolomi Dudu",
  description:
    "Privacy information explaining how Jolomi Dudu collects, uses and protects personal information submitted through this website.",
};

const sections = [
  {
    title: "1. About this policy",
    content: (
      <>
        <p>
          This Privacy Policy explains how Jolomi Dudu collects, uses,
          stores and protects personal information when you visit this
          website, contact me, submit an enquiry, book a conversation or
          otherwise interact with the services provided through this website.
        </p>

        <p className="mt-4">
          I respect your privacy and aim to collect only information that is
          reasonably necessary for communicating with you, understanding your
          requirements and providing agreed professional services.
        </p>
      </>
    ),
  },
  {
    title: "2. Information you provide",
    content: (
      <>
        <p>
          Depending on how you interact with the website, you may choose to
          provide information such as:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your company or organization</li>
          <li>Your professional role</li>
          <li>Project or service requirements</li>
          <li>Estimated project budget</li>
          <li>Preferred project timeline</li>
          <li>Messages and other information included in your enquiry</li>
          <li>Information you provide when scheduling a meeting</li>
          <li>Learning program details, goals and enrollment preferences</li>
          <li>Payment details required to verify or process a transaction</li>
          <li>Guardian or parent details for learners under the age of 18</li>
        </ul>

        <p className="mt-4">
          You are not required to provide information that is not necessary
          for the purpose of your enquiry or enrollment.
        </p>
      </>
    ),
  },
  {
    title: "3. How information is collected",
    content: (
      <>
        <p>
          Information may be collected when you:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Submit the contact or project enquiry form</li>
          <li>Send an email</li>
          <li>Book a meeting or consultation</li>
          <li>Communicate with me about a project or service</li>
          <li>Use other features of the website that request information</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. How your information is used",
    content: (
      <>
        <p>
          Information you provide may be used to:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Respond to enquiries and requests</li>
          <li>Understand your project or business requirements</li>
          <li>Prepare proposals, estimates or recommendations</li>
          <li>Schedule consultations or meetings</li>
          <li>Deliver agreed professional services</li>
          <li>Communicate with you about an active engagement</li>
          <li>Provide mentorship or training services</li>
          <li>Maintain appropriate business and project records</li>
          <li>Improve the website and the services offered</li>
          <li>Protect the website and prevent misuse or abuse</li>
        </ul>

        <p className="mt-4">
          Personal information will not be used for purposes that are
          materially different from those described here without appropriate
          notice or another lawful basis where required.
        </p>
      </>
    ),
  },
  {
    title: "5. Project and business information",
    content: (
      <>
        <p>
          If you contact me about a business, software project, technology
          strategy, consulting engagement or other professional service, your
          enquiry may contain confidential business or technical information.
        </p>

        <p className="mt-4">
          Such information is handled professionally and is used for the
          purpose of evaluating, discussing and delivering the relevant
          engagement.
        </p>

        <p className="mt-4">
          Where an engagement requires formal confidentiality obligations, an
          appropriate confidentiality agreement or NDA can be established
          separately.
        </p>
      </>
    ),
  },
  {
    title: "6. Learning and payment information",
    content: (
      <>
        <p>
          For learning enrollments, the website may collect the information
          needed to manage a learner profile, such as the learner&apos;s name,
          email address, learning goals, program preferences, country,
          communication preferences, and payment-related information required
          to confirm enrollment and maintain access to course resources.
        </p>

        <p className="mt-4">
          Payments are processed through a secure third-party payment provider.
          Payment references, confirmation status and transaction amounts may
          be retained so that enrollment and account access can be verified and
          support or refunds can be handled appropriately.
        </p>

        <p className="mt-4">
          Temporary passwords may be generated for learner account access when
          necessary. These should be changed after sign-in, and access should
          be kept secure and private.
        </p>
      </>
    ),
  },
  {
    title: "7. Third-party services",
    content: (
      <>
        <p>
          Some website functions may rely on third-party services to provide
          functionality such as scheduling, hosting, communication, analytics,
          payment processing, or other technical services.
        </p>

        <p className="mt-4">
          For example, payment processing may be handled through Paystack.
          When you use a third-party service, information may be processed
          according to that provider&apos;s own privacy policy and terms.
        </p>

        <p className="mt-4">
          Third-party services are selected based on their relevance to the
          website or professional engagement. Where appropriate, links to
          their policies may be provided.
        </p>
      </>
    ),
  },
  {
    title: "8. Cookies",
    content: (
      <>
        <p>
          This website may use cookies or similar technologies for basic
          website functionality and preferences.
        </p>

        <p className="mt-4">
          For example, the website may store a preference relating to whether
          you have interacted with a cookie notice.
        </p>

        <p className="mt-4">
          Your browser may also provide controls for managing or deleting
          cookies. If additional analytics, advertising or tracking
          technologies are introduced in the future, this policy may be
          updated to reflect those changes.
        </p>
      </>
    ),
  },
  {
    title: "9. How information is protected",
    content: (
      <>
        <p>
          Reasonable technical and organizational measures are used to protect
          personal information against unauthorized access, loss, misuse,
          alteration or disclosure.
        </p>

        <p className="mt-4">
          However, no website, internet transmission or electronic storage
          system can be guaranteed to be completely secure. You should avoid
          submitting highly sensitive information through ordinary website
          forms or email unless specifically requested and an appropriate
          secure method has been provided.
        </p>
      </>
    ),
  },
  {
    title: "10. How long information is retained",
    content: (
      <>
        <p>
          Personal information is retained only for as long as reasonably
          necessary for the purpose for which it was collected, including
          responding to enquiries, managing professional engagements,
          maintaining appropriate business records, supporting learning
          access and meeting applicable legal or contractual obligations.
        </p>

        <p className="mt-4">
          When information is no longer required, reasonable steps will be
          taken to delete, anonymize or securely dispose of it where
          appropriate.
        </p>
      </>
    ),
  },
  {
    title: "11. Your privacy rights",
    content: (
      <>
        <p>
          Depending on applicable data protection law, you may have rights
          relating to your personal information, including the right to:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Request access to personal information held about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of information where applicable</li>
          <li>Object to or request restriction of certain processing</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Raise a concern about how your information is handled</li>
        </ul>

        <p className="mt-4">
          These rights may be subject to legal or contractual limitations.
          Requests can be made using the contact details provided below.
        </p>
      </>
    ),
  },
  {
    title: "12. International visitors",
    content: (
      <>
        <p>
          This website may be accessed by people outside Nigeria and may use
          service providers that operate in different countries.
        </p>

        <p className="mt-4">
          As a result, personal information may be processed or stored outside
          the country in which you are located. Where applicable, reasonable
          steps will be taken to ensure that such processing is carried out
          with appropriate safeguards.
        </p>
      </>
    ),
  },
  {
    title: "13. Children and guardian consent",
    content: (
      <p>
        This website is intended primarily for professional and general
        audiences. It is not intentionally designed to collect personal
        information from children without appropriate consent. For learners
        under the age of 18, a parent or legal guardian must provide consent,
        contact information and any required enrollment details before a
        learning account is created. If you believe a child has provided
        personal information through the website without appropriate consent,
        please contact me so that the information can be reviewed and, where
        appropriate, removed.
      </p>
    ),
  },
  {
    title: "14. Changes to this policy",
    content: (
      <p>
        This Privacy Policy may be updated from time to time to reflect
        changes to the website, services, technology or applicable privacy
        requirements. The updated version will be published on this page with
        the relevant effective date.
      </p>
    ),
  },
  {
    title: "15. Contact",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy, want to exercise a
          privacy right or have concerns about how your information is handled,
          please contact:
        </p>

        <div className="mt-5 border-l-2 border-[#008c87] pl-5">
          <p className="font-semibold text-[#111111]">Jolomi Dudu</p>

          <a
            href="mailto:jollofdudu@gmail.com"
            className="mt-1 inline-block text-[#008c87] hover:underline"
          >
            jollofdudu@gmail.com
          </a>

          <p className="mt-1 text-sm text-black/50">
            Lagos, Nigeria
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        {/* HERO */}
        <section className="px-6 pb-16 pt-20 md:px-12 md:pb-24 md:pt-28 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#751a1a]">
              Privacy policy
            </p>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">
                Your information, handled with care.
              </h1>

              <div className="max-w-md">
                <p className="text-lg leading-8 text-black/60">
                  This policy explains what information this website may
                  collect, why it is collected and how it is handled when you
                  get in touch.
                </p>

                <p className="mt-5 text-xs uppercase tracking-[0.15em] text-black/40">
                  Last updated: October 2026
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY */}
        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
              {/* SIDEBAR */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">
                    On this page
                  </p>

                  <nav className="mt-6 space-y-3">
                    {sections.map((section) => (
                      <a
                        key={section.title}
                        href={`#${section.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="block text-sm leading-5 text-black/45 transition-colors hover:text-[#008c87]"
                      >
                        {section.title.replace(/^\d+\.\s*/, "")}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* CONTENT */}
              <div className="border-t border-black/15">
                {sections.map((section) => (
                  <section
                    key={section.title}
                    id={section.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                    className="scroll-mt-28 border-b border-black/15 py-9 md:py-12"
                  >
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {section.title}
                    </h2>

                    <div className="mt-5 max-w-3xl text-base leading-8 text-black/60">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#111111] px-6 py-16 text-[#f5f5f0] md:px-12 md:py-20 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78d8ca]">
                Privacy questions?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
                Need clarification about your information?
              </h2>
            </div>

            <a
              href="mailto:jollofdudu@gmail.com?subject=Privacy%20Enquiry"
              className="inline-flex min-h-12 shrink-0 items-center justify-between gap-3 bg-[#d7f36a] px-5 py-3 text-sm font-semibold text-[#163d34] transition-colors hover:bg-white"
            >
              <span>Contact me</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
