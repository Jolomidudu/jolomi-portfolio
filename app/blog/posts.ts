export const posts = [
  {
    slug: "choose-the-right-first-version-of-a-digital-product",
    category: "Technology",
    title: "How to choose the right first version of a digital product",
    description: "A practical way to decide what belongs in your MVP before time and budget disappear.",
    content: [
      "A first version should prove that a product solves a real problem. It does not need to represent every idea you have for the finished product. The goal is to get one useful experience into the hands of the right people and learn from how they use it.",
      "Start by naming the person you are building for and the job they need to get done. Then map the shortest complete path from their problem to a meaningful result. For a booking product, that might be finding an available time, booking it and receiving confirmation. Features that do not support that path can usually wait.",
      "Separate essentials from assumptions. Essentials are needed to deliver the core result safely and reliably. Assumptions are things you believe users will want, but have not tested yet. A prototype, a manual process or a small pilot can often test an assumption more cheaply than building a full feature.",
      "Before development begins, decide what evidence would make the first version successful. That could be completed bookings, repeat use, qualified enquiries or a shorter turnaround time. A clear measure gives the team a better basis for deciding what to improve next.",
      "A focused first release is not a smaller ambition. It is a way to make progress with less guesswork: solve one important problem well, listen closely, and let real use guide the next version.",
    ],
  },
  {
    slug: "website-as-a-business-asset",
    category: "Business",
    title: "The difference between a website and a business asset",
    description: "A website should do more than exist. It should answer questions, build trust and create a next step.",
    content: [
      "A website becomes a business asset when it helps someone move forward. That starts with clarity: a visitor should quickly understand who you help, what you offer and what to do next.",
      "Treat each page as part of a customer conversation. A service page can explain the outcome, outline what is included and address common concerns. A case study can show how the work looked in practice. Contact details and calls to action should be easy to find when a visitor is ready.",
      "Trust is built through useful proof, not decoration alone. Specific examples, honest testimonials, clear pricing guidance and a consistent identity help people judge whether your business is right for them. Keep claims accurate and make the next step low-friction.",
      "The work continues after launch. Check that pages load well on phones, forms reach the right inbox, links still work and analytics answer questions you actually care about. Use what customers ask you to improve the pages over time.",
      "A strong website is not simply a digital brochure. It is a maintained part of how your business explains itself, earns confidence and turns interest into action.",
    ],
  },
  {
    slug: "what-to-budget-for-when-building-software",
    category: "Finance",
    title: "What to budget for when building software",
    description: "The cost conversation gets easier when design, development, maintenance and growth are separated.",
    content: [
      "The build estimate is only one part of a software budget. A more useful plan separates the work into stages so you can see what each investment covers and make decisions before costs become surprises.",
      "Discovery clarifies the audience, goals, requirements and risks. Design turns those decisions into flows and interfaces that can be reviewed before development. Development builds the agreed scope, while testing checks that the most important paths work across devices and real-world conditions.",
      "Also plan for launch costs such as hosting, domains, third-party services, app-store accounts or payment-provider fees where applicable. These costs depend on the product and its usage, so identify them early rather than treating them as part of a vague technical allowance.",
      "After launch, software needs care. Budget for security updates, backups, bug fixes, monitoring and improvements based on user feedback. Ongoing support can be a monthly arrangement or a planned allocation of team time.",
      "A clear scope makes quotes easier to compare. Ask what is included, what is excluded, how changes are handled, what you will own at handover and what support is available afterward. The cheapest initial figure is not always the lowest-cost path if important work has been left out.",
    ],
  },
  {
    slug: "making-room-for-deeper-creative-work",
    category: "Lifestyle",
    title: "Making room for deeper creative work",
    description: "A few quiet systems that make it easier to think, learn and finish meaningful projects.",
    content: [
      "Creative work is easier to begin when you do not have to reconstruct your priorities every day. A small amount of structure can protect attention without turning the work into a rigid routine.",
      "Keep one trusted place for ideas and open tasks. When something comes to mind, capture it there instead of switching immediately to act on it. A short review later helps you decide what is worth keeping and what can be dropped.",
      "Give demanding work a defined block of time and a clear next action. ‘Work on the project’ is difficult to start; ‘draft the first screen’ or ‘outline three options’ gives your attention somewhere concrete to land. Protect the block from notifications where you can.",
      "Make stopping easier too. At the end of a session, leave a note about what you finished and what you will do next. That small handoff reduces the effort of returning to the work later.",
      "Deep work is not about filling every hour. It is about creating enough space to make steady progress on things that matter, while leaving room for rest and the rest of life.",
    ],
  },
] as const;
