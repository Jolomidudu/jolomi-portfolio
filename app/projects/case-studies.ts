export type CaseStudyCategory = "analytics" | "bdm" | "cloud" | "digital-marketing" | "cybersecurity";

export type CloudServiceUse = {
  name: string;
  usedFor: string;
  solution: string;
};

export type CaseStudy = {
  id: string;
  category: CaseStudyCategory;
  discipline: string;
  title: string;
  problem: string;
  solution: string;
  outputs: readonly string[];
  cloudServices?: readonly CloudServiceUse[];
};

export const caseStudies: readonly CaseStudy[] = [
  // {
  //   id: "bdm-qualified-lead-pipeline",
  //   category: "bdm",
  //   discipline: "Business Development",
  //   title: "Create a qualified-lead pipeline",
  //   problem: "Referrals and inbound opportunities are handled inconsistently, making it difficult to prioritize prospects or know the next action.",
  //   solution: "Define an ideal-customer profile, qualification questions, clear pipeline stages, and an owner and next step for every opportunity.",
  //   outputs: ["Lead qualification framework", "Pipeline stages and CRM fields", "Weekly opportunity review cadence"],
  // },
  // {
  //   id: "bdm-package-service-offer",
  //   category: "bdm",
  //   discipline: "Business Development",
  //   title: "Turn a broad capability into a clear offer",
  //   problem: "Prospects struggle to understand what a service includes, who it is for, and how to take the first step.",
  //   solution: "Shape the service around a defined buyer need, explain scope and deliverables in plain language, and create a consistent discovery-to-proposal path.",
  //   outputs: ["Buyer and needs summary", "Service offer and scope outline", "Discovery and proposal checklist"],
  // },
  // {
  //   id: "bdm-partnership-development",
  //   category: "bdm",
  //   discipline: "Business Development",
  //   title: "Build a focused partner-development motion",
  //   problem: "Partnership outreach is ad hoc, with unclear partner fit, shared value, and follow-up responsibilities.",
  //   solution: "Prioritize partner profiles, document mutual value, define an introduction and onboarding process, and track conversations through agreed next steps.",
  //   outputs: ["Partner-fit scorecard", "Mutual-value proposition", "Outreach and follow-up workflow"],
  // },
  {
  id: "analytics-flight-booking-funnel",
  category: "analytics",
  discipline: "Data Analytics",
  title: "Optimised flight-booking conversion and reduced customer drop-off",
  problem: "Vueling Airlines receives substantial flight searches through its website and mobile application, but many prospective passengers abandon the booking process before completing payment. Management lacks visibility into where customers drop off, how booking conversion differs across flight routes and digital channels, and whether fare changes or additional booking costs influence purchasing decisions.",
  solution: "Analyse the complete flight-booking journey from flight search and selection to passenger information, payment initiation, and confirmed booking. Use SQL, Python, and Power BI to measure stage-to-stage conversion, identify abandonment patterns, compare website and mobile app performance, and evaluate booking behaviour across routes, customer segments, fare categories, and travel periods.",
  outputs: [
    "Interactive flight-booking funnel dashboard",
    "Booking conversion and abandonment analysis",
    "Flight route performance comparison",
    "Website versus mobile app conversion analysis",
    "Fare pricing and booking value analysis",
    "Customer segment and seasonal booking filters"
  ],
},
 {
  id: "analytics-bank-customer-retention",
  category: "analytics",
  discipline: "Data Analytics",
  title: "Identified customer attrition and improved banking customer retention",
  problem: "Rico Microfinance experiences fluctuations in customer account activity and engagement, but management lacks sufficient visibility into which customers are becoming inactive, the factors contributing to customer attrition, and how retention patterns differ across customer segments, account types, branches, and digital banking channels. This makes it difficult to identify customers at risk of leaving, improve customer engagement, and develop effective retention strategies.",
  solution: "Analyse customer account activity, transaction frequency, account balances, product usage, customer complaints, and digital banking engagement to identify inactivity and potential attrition patterns. Use SQL, Python, and Power BI to segment customers by engagement level, compare retention rates across account types and branches, identify behavioural changes preceding inactivity, and monitor customer retention trends over time.",
  outputs: [
    "Interactive customer retention dashboard",
    "Customer inactivity and attrition analysis",
    "Customer segmentation by engagement and account type",
    "Branch-level customer retention comparison",
    "Digital banking adoption and engagement analysis",
    "Customer attrition trends and period filters"
  ],
},
  // {
  //   id: "cloud-safe-deployment-pipeline",
  //   category: "cloud",
  //   discipline: "Cloud & DevOps",
  //   title: "Make deployments repeatable and recoverable",
  //   problem: "Manual releases and inconsistent environments make it hard to review changes, identify failures, and roll back safely.",
  //   solution: "Use infrastructure as code and a CI/CD pipeline with automated checks, environment-specific configuration, approval gates, and documented rollback steps.",
  //   outputs: ["Versioned infrastructure and deployment config", "Automated build, test, and release stages", "Rollback and release runbook"],
  //   cloudServices: [
  //     {
  //       name: "Amazon ECR",
  //       usedFor: "Stores versioned container images built by the delivery pipeline.",
  //       solution: "Use immutable image tags and lifecycle policies so deployments use traceable, approved builds.",
  //     },
  //     {
  //       name: "Amazon ECS with Fargate",
  //       usedFor: "Runs containerized application services without managing EC2 hosts.",
  //       solution: "Configure health checks, service scaling, and deployment rollback for safer releases.",
  //     },
  //     {
  //       name: "AWS IAM",
  //       usedFor: "Provides identities and permissions to deployment jobs and running tasks.",
  //       solution: "Separate task and deployment roles, then scope each role to only the required resources and actions.",
  //     },
  //   ],
  // },
  // {
  //   id: "cloud-observability-reliability",
  //   category: "cloud",
  //   discipline: "Cloud & DevOps",
  //   title: "Improve production visibility and incident response",
  //   problem: "When an application slows or fails, teams lack correlated telemetry and clear ownership for diagnosis and response.",
  //   solution: "Establish useful logs, metrics, and traces; define service-level indicators; route actionable alerts; and document incident roles and recovery steps.",
  //   outputs: ["Service health and latency dashboards", "Alert thresholds and ownership", "Incident response and recovery runbooks"],
  //   cloudServices: [
  //     {
  //       name: "Amazon CloudWatch",
  //       usedFor: "Collects application logs, infrastructure metrics, and alarms.",
  //       solution: "Create service dashboards and actionable alerts tied to agreed health and latency thresholds.",
  //     },
  //     {
  //       name: "AWS X-Ray",
  //       usedFor: "Traces requests across instrumented application components.",
  //       solution: "Use trace timelines and service maps to narrow down slow or failing dependencies.",
  //     },
  //     {
  //       name: "AWS Backup",
  //       usedFor: "Schedules and manages recovery points for supported AWS resources.",
  //       solution: "Set retention policies and regularly test restores against recovery objectives.",
  //     },
  //   ],
  // },
  // {
  //   id: "cloud-infrastructure-governance",
  //   category: "cloud",
  //   discipline: "Cloud & DevOps",
  //   title: "Control infrastructure drift, access, and spend",
  //   problem: "Untracked environments, broad permissions, and inconsistent resource ownership increase operational and security risk.",
  //   solution: "Standardize environment provisioning, apply least-privilege access, tag resources, review budgets, and test backup and recovery procedures.",
  //   outputs: ["Infrastructure-as-code baseline", "Access and environment review checklist", "Cost, backup, and recovery controls"],
  //   cloudServices: [
  //     {
  //       name: "AWS IAM Identity Center",
  //       usedFor: "Manages workforce access to AWS accounts and supported applications.",
  //       solution: "Assign role-based permission sets, require MFA, and remove standing administrator access where possible.",
  //     },
  //     {
  //       name: "AWS Config",
  //       usedFor: "Records resource configuration and evaluates it against selected rules.",
  //       solution: "Use configuration rules to identify drift from security and operations baselines.",
  //     },
  //     {
  //       name: "AWS Budgets and Cost Explorer",
  //       usedFor: "Reviews cloud spend, allocation, trends, and forecasted cost.",
  //       solution: "Apply ownership tags, budget thresholds, and alerts to surface unexpected spend early.",
  //     },
  //     {
  //       name: "AWS KMS",
  //       usedFor: "Creates and controls encryption keys used by supported AWS services.",
  //       solution: "Restrict key policies and access paths, and align rotation and auditing with the security policy.",
  //     },
  //   ],
  // },
  // {
  //   id: "marketing-content-system",
  //   category: "digital-marketing",
  //   discipline: "Digital Marketing",
  //   title: "Create a consistent social content system",
  //   problem: "Posting is irregular and content topics are disconnected from audience questions and business priorities.",
  //   solution: "Define content pillars, map them to audience needs, and plan a reusable calendar with platform-appropriate formats and review ownership.",
  //   outputs: ["Audience and content-pillar outline", "Channel-specific publishing calendar", "Content review and reuse workflow"],
  // },
  // {
  //   id: "marketing-campaign-conversion",
  //   category: "digital-marketing",
  //   discipline: "Digital Marketing",
  //   title: "Connect campaign attention to a clear next step",
  //   problem: "Campaign posts generate attention but send audiences to generic pages without a focused offer or measurable conversion path.",
  //   solution: "Align the audience, message, call to action, and landing-page content, then use tagged links and controlled creative tests to compare engagement.",
  //   outputs: ["Campaign message and audience brief", "Focused landing-page and call-to-action plan", "UTM and creative-test measurement plan"],
  // },
  // {
  //   id: "marketing-social-lead-follow-up",
  //   category: "digital-marketing",
  //   discipline: "Digital Marketing",
  //   title: "Turn social enquiries into trackable follow-up",
  //   problem: "Questions and enquiries arrive through multiple social channels, but ownership and follow-up are difficult to track.",
  //   solution: "Set clear response pathways, capture consented lead details through suitable forms, and define a handoff and follow-up process.",
  //   outputs: ["Channel response and escalation guide", "Lead-capture and CRM handoff flow", "Source and follow-up tracking view"],
  // },
  // {
  //   id: "cybersecurity-identity-access",
  //   category: "cybersecurity",
  //   discipline: "Cybersecurity",
  //   title: "Reduce identity and access exposure",
  //   problem: "Access accumulates as people change roles, shared accounts persist, and privileged permissions are not reviewed consistently.",
  //   solution: "Inventory identities, apply role-based least privilege and MFA, formalize joiner-mover-leaver steps, and schedule privileged-access reviews.",
  //   outputs: ["Identity and privileged-access inventory", "MFA and role-based access baseline", "Access review and offboarding checklist"],
  // },
  // {
  //   id: "cybersecurity-detection-response",
  //   category: "cybersecurity",
  //   discipline: "Cybersecurity",
  //   title: "Prepare a coordinated security response",
  //   problem: "Security signals are spread across systems, leaving teams uncertain about what to investigate and how to preserve evidence.",
  //   solution: "Prioritize log sources and alert scenarios, assign response roles, and document containment, escalation, communications, and recovery steps.",
  //   outputs: ["Logging and alert-use-case plan", "Incident severity and escalation matrix", "Response and evidence-handling runbooks"],
  // },
  // {
  //   id: "cybersecurity-application-hardening",
  //   category: "cybersecurity",
  //   discipline: "Cybersecurity",
  //   title: "Strengthen application and cloud security controls",
  //   problem: "Security checks happen late, while vulnerable dependencies, exposed secrets, and configuration risks can reach production.",
  //   solution: "Add threat modeling and secure configuration review to delivery, scan dependencies and secrets, and define a prioritized patch and remediation process.",
  //   outputs: ["Threat-model and security-review checklist", "Dependency, secret, and configuration checks", "Risk-ranked remediation workflow"],
  // },
];