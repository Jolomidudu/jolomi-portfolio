
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">

        <a
          href="#"
          className="text-xl font-bold tracking-tight"
        >
          JOLOMI<span className="text-[#00A9A5]">.</span>DUDU
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a
            href="#work"
            className="transition-opacity hover:opacity-50"
          >
            WORK
          </a>

          <a
            href="#about"
            className="transition-opacity hover:opacity-50"
          >
            ABOUT
          </a>

          <a
            href="#services"
            className="transition-opacity hover:opacity-50"
          >
            SERVICES
          </a>

          <a
  href="#experience"
  className="transition-opacity hover:opacity-50"
>
  EXPERIENCE
</a>

          <a
            href="#contact"
            className="transition-opacity hover:opacity-50"
          >
            CONTACT
          </a>
        </div>

        <a
          href="#contact"
          className="hidden rounded-full border border-black px-5 py-2.5 text-sm font-medium transition-all hover:bg-black hover:text-white md:block"
        >
          Let&apos;s Talk
        </a>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

      </nav>


      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="flex min-h-[calc(100vh-90px)] flex-col justify-center px-6 pb-16 pt-16 md:px-12 lg:px-16">

        <div className="mb-8 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]">

          <span className="h-2.5 w-2.5 rounded-full bg-[#00A9A5]" />

          <span>
            Available for new opportunities
          </span>

        </div>


        <div className="max-w-7xl">

          <p className="mb-4 text-lg font-medium md:text-xl">
            Hello, I&apos;m Jolomi.
          </p>

          <h1 className="text-[16vw] font-bold leading-[0.8] tracking-[-0.07em] md:text-[13vw] lg:text-[11vw]">

            <span className="block">
              SOFTWARE
            </span>

            <span className="block">

              <span className="text-[#00A9A5]">
                ENGINEER
              </span>

              <span>
                .
              </span>

            </span>

          </h1>

        </div>


        <div className="mt-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div className="max-w-xl">

            <p className="text-lg leading-relaxed text-black/65 md:text-xl">
              I design and build modern web and mobile applications
              that transform ideas into useful digital experiences.
            </p>

          </div>


          <a
            href="#work"
            className="group flex w-fit items-center gap-4"
          >

            <span className="text-sm font-semibold uppercase tracking-wider">
              Explore my work
            </span>

            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black transition-all duration-300 group-hover:bg-black group-hover:text-white">
              ↓
            </span>

          </a>

        </div>


        <div className="mt-16 grid grid-cols-2 gap-y-5 border-t border-black/15 pt-5 text-xs uppercase tracking-wider text-black/50 md:grid-cols-5">

          <span>Web Development</span>

          <span>Mobile Development</span>

          <span>Backend Engineering</span>

          <span>Data Analytics</span>

          <span className="md:text-right">
            Nigeria
          </span>

        </div>

      </section>


      
     {/* =====================================================
    ABOUT
====================================================== */}
<section
  id="about"
  className="border-t border-black/10 bg-[#111111] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
>
  <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

    {/* Section Label */}
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
        About Me
      </p>

      <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/45">
        Developer, problem solver and digital product builder.
      </p>
    </div>


    {/* Main Content */}
    <div>

      {/* Photo + Introduction */}
      <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr] md:items-start">

        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/10">

          <Image
            src="/images/jolomi2.jpg"
            alt="Jolomi Dudu"
            fill
            priority
            sizes="(max-width: 768px) 130vw, 35vw"
            className="object-cover"
          />

        </div>


        {/* Introduction */}
        <div>

          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl lg:text-6xl">

            I don&apos;t just write code.

            <span className="text-[#00A9A5]">
              {" "}I turn ideas into digital products.
            </span>

          </h2>

          <p className="mt-8 text-base leading-8 text-white/65 md:text-lg">
            I&apos;m Jolomi Dudu, a software engineer focused on
            building modern web and mobile applications. I enjoy
            taking ideas from concept to functional, polished digital
            products.
          </p>

          <p className="mt-6 text-base leading-8 text-white/65 md:text-lg">
            My work spans frontend development, mobile applications,
            backend systems, APIs, databases and data analytics. I
            combine technology and business thinking to create products
            that are useful, reliable and easy to use.
          </p>

        </div>

      </div>


      {/* Statistics */}
      <div className="mt-20 grid grid-cols-2 border-t border-white/15 pt-8 md:grid-cols-4">

        <div>
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            9+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Years Experience
          </p>
        </div>


        <div>
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            20+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Projects
          </p>
        </div>


        <div className="mt-8 md:mt-0">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            4+
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Core Disciplines
          </p>
        </div>


        <div className="mt-8 md:mt-0">
          <p className="text-4xl font-semibold tracking-tight md:text-5xl">
            ∞
          </p>

          <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
            Ideas to Build
          </p>
        </div>

      </div>

    </div>

  </div>
</section>


      {/* =====================================================
          FEATURED WORK
      ====================================================== */}
    {/* =====================================================
    PROJECTS
====================================================== */}
<section
  id="work"
  className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16"
>
  <div className="mb-16 grid gap-8 md:grid-cols-[1fr_0.45fr] md:items-end">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
        Selected Work
      </p>

      <h2 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-6xl lg:text-7xl">
        Things I&apos;ve built.
      </h2>
    </div>

    <p className="max-w-sm text-sm leading-6 text-black/50 md:justify-self-end">
      A selection of digital products, platforms and applications
      I&apos;ve designed and developed across different industries.
    </p>

  </div>


  {/* Projects */}
  <div className="grid gap-14">

    {/* =====================================================
        GREYFUNDR
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/greyfundr.png"
            alt="Greyfundr crowdfunding platform"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            01 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Greyfundr
          </h3>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A crowdfunding and digital community platform designed
            to help people raise funds, support causes and connect
            with communities.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Flutter",
              "Node.js",
              "PostgreSQL",
              "REST API",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    {/* =====================================================
        SPA ELARIS
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#ded5c7]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/spaelaris.png"
            alt="Spa Elaris wellness website"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            02 / Web Development
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Spa Elaris
          </h3>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A premium wellness and spa platform designed to showcase
            treatments, services, packages and provide a polished
            digital experience for customers.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "Responsive UI",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    {/* =====================================================
        SCHOOL MANAGEMENT
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#111111]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/school-management.png"
            alt="School management platform dashboard"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            03 / SaaS Platform
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            School Management Platform
          </h3>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A comprehensive school management system connecting
            administrators, teachers, students and parents through
            a centralized digital platform.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "MySQL",
              "REST API",
              "Dashboard",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>


    {/* =====================================================
        FOOD DELIVERY
    ====================================================== */}
    <article className="group">

      <div className="overflow-hidden rounded-[1.5rem] bg-[#dfe7df]">

        <div className="relative aspect-[16/9]">

          <Image
            src="/images/projects/food-delivery.png"
            alt="Food delivery application"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

        </div>

      </div>


      <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            04 / Web & Mobile
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Food Delivery Platform
          </h3>
        </div>


        <div className="max-w-2xl">

          <p className="text-sm leading-7 text-black/55 md:text-base">
            A food ordering and delivery platform connecting
            customers, restaurants and delivery partners through
            a streamlined digital experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {[
              "Next.js",
              "Node.js",
              "MongoDB",
              "Maps API",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

      </div>

    </article>

  </div>

</section>


      {/* =====================================================
          SERVICES
      ====================================================== */}
      <section
        id="services"
        className="bg-[#111111] px-6 py-24 text-[#f5f5f0] md:px-12 md:py-32 lg:px-16"
      >

        <div className="mb-20">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            Expertise
          </p>

          <h2 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl">
            What I bring
            <span className="text-[#00A9A5]">
              {" "}to the table.
            </span>
          </h2>

        </div>


        <div className="divide-y divide-white/10 border-y border-white/10">

          {/* Service 01 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              01
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Web Development
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Modern, responsive websites and web applications
                designed around performance, usability and business goals.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 02 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              02
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Mobile App Development
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Cross-platform mobile applications with intuitive
                interfaces and scalable architectures.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 03 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              03
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Backend & APIs
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Secure backend systems, databases, APIs and integrations
                that power reliable digital products.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>


          {/* Service 04 */}
          <div className="group grid gap-6 py-10 md:grid-cols-[100px_1fr_100px] md:items-center">

            <span className="text-sm text-white/30">
              04
            </span>

            <div>

              <h3 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-[#00A9A5] md:text-5xl">
                Data Analytics
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Data cleaning, analysis, visualization and reporting
                that turn raw information into useful insights.
              </p>

            </div>

            <span className="text-right text-3xl text-white/20 transition-all group-hover:translate-x-2 group-hover:text-[#00A9A5]">
              ↗
            </span>

          </div>

        </div>

      </section>

            {/* =====================================================
          EXPERIENCE
      ====================================================== */}
      <section
        id="experience"
        className="bg-[#f5f5f0] px-6 py-24 md:px-12 md:py-32 lg:px-16"
      >
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

          {/* Section Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
              Experience
            </p>

            <h2 className="mt-6 max-w-md text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Where I&apos;ve made an impact.
            </h2>
          </div>


          {/* Experience List */}
          <div className="border-t border-black/15">

            {/* Experience 01 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  2024 — Present
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Software Engineer
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Independent / Freelance
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Designing and developing web and mobile applications,
                  backend systems and digital products for businesses,
                  startups and personal ventures.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Flutter",
                    "Next.js",
                    "Node.js",
                    "TypeScript",
                    "Databases",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>


            {/* Experience 02 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  Previous
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Web & Mobile Developer
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Software Development
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Building responsive websites, mobile applications,
                  APIs and database-driven systems with a focus on
                  usability and reliable performance.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Flutter",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "REST APIs",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>


            {/* Experience 03 */}
            <div className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  Previous
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Data Analyst
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Data & Business Intelligence
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Working with data to clean, analyze and visualize
                  information, helping transform raw datasets into
                  useful business insights and decisions.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Excel",
                    "SQL",
                    "MySQL",
                    "Tableau",
                    "Data Cleaning",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>


            {/* Experience 04 */}
            <div className="grid gap-6 py-10 md:grid-cols-[150px_1fr_120px]">

              <div>
                <p className="text-sm text-black/40">
                  Earlier
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Business Development
                </h3>

                <p className="mt-1 text-sm text-[#00A9A5]">
                  Strategy & Growth
                </p>

                <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
                  Combining technology, strategy and business thinking
                  to identify opportunities, develop solutions and
                  help organizations grow.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Strategy",
                    "Business Development",
                    "Product Thinking",
                    "Planning",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-black/40 md:text-right">
                Nigeria
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT
      ====================================================== */}
      <section
        id="contact"
        className="bg-[#f5f5f0] px-6 py-28 md:px-12 md:py-40 lg:px-16"
      >

        <div className="max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">
            Have a project?
          </p>

          <h2 className="mt-6 text-[15vw] font-bold leading-[0.8] tracking-[-0.07em] md:text-[11vw]">
            LET&apos;S
            <br />
            <span className="text-[#00A9A5]">
              TALK.
            </span>
          </h2>

        </div>


        <div className="mt-16 flex flex-col justify-between gap-10 border-t border-black/15 pt-8 md:flex-row md:items-end">

          <div>

            <p className="max-w-md text-lg leading-8 text-black/55">
              Have an idea, project or opportunity you&apos;d like to
              discuss? I&apos;d love to hear about it.
            </p>

          </div>


          <a
            href="mailto:jollofdudu@gmail.com"
            className="group flex items-center gap-5"
          >

            <span className="text-lg font-semibold">
              jollofdudu@gmail.com
            </span>

            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-black transition-all group-hover:bg-black group-hover:text-white">
              ↗
            </span>

          </a>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-black/10 bg-[#f5f5f0] px-6 py-8 md:px-12 lg:px-16">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          <div>

            <p className="text-xl font-bold">
              J<span className="text-[#00A9A5]">.</span>DUDU
            </p>

            <p className="mt-2 text-sm text-black/40">
              Software Engineer · Web & Mobile Developer
            </p>

          </div>


          <div className="flex flex-wrap gap-6 text-sm">

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              GitHub
            </a>

            <a
              href="#"
              className="transition-opacity hover:opacity-50"
            >
              X / Twitter
            </a>

          </div>

        </div>


        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs text-black/40 md:flex-row">

          <p>
            © {new Date().getFullYear()} Jolomi Dudu. All rights reserved.
          </p>

          <p>
            Built with Next.js
          </p>

        </div>

      </footer>

    </main>
  );
}