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
  {
    id: "bdm-qualified-lead-pipeline",
    category: "bdm",
    discipline: "Business Development",
    title: "Create a qualified-lead pipeline",
    problem: "Referrals and inbound opportunities are handled inconsistently, making it difficult to prioritize prospects or know the next action.",
    solution: "Define an ideal-customer profile, qualification questions, clear pipeline stages, and an owner and next step for every opportunity.",
    outputs: ["Lead qualification framework", "Pipeline stages and CRM fields", "Weekly opportunity review cadence"],
  },
  {
    id: "bdm-package-service-offer",
    category: "bdm",
    discipline: "Business Development",
    title: "Turn a broad capability into a clear offer",
    problem: "Prospects struggle to understand what a service includes, who it is for, and how to take the first step.",
    solution: "Shape the service around a defined buyer need, explain scope and deliverables in plain language, and create a consistent discovery-to-proposal path.",
    outputs: ["Buyer and needs summary", "Service offer and scope outline", "Discovery and proposal checklist"],
  },
  {
    id: "bdm-partnership-development",
    category: "bdm",
    discipline: "Business Development",
    title: "Build a focused partner-development motion",
    problem: "Partnership outreach is ad hoc, with unclear partner fit, shared value, and follow-up responsibilities.",
    solution: "Prioritize partner profiles, document mutual value, define an introduction and onboarding process, and track conversations through agreed next steps.",
    outputs: ["Partner-fit scorecard", "Mutual-value proposition", "Outreach and follow-up workflow"],
  },
  {
    id: "analytics-executive-performance-dashboard",
    category: "analytics",
    discipline: "Data Analytics",
    title: "Unify leadership performance reporting",
    problem: "Teams prepare reports from separate spreadsheets, use different metric definitions, and spend time reconciling numbers before decisions.",
    solution: "Define a shared KPI glossary and reporting model, then organize the measures into an executive dashboard with clear time periods and filters.",
    outputs: ["KPI definition sheet", "Trend-line and period-comparison charts", "Source-mix and performance dashboard"],
  },
  {
    id: "analytics-sales-funnel-visibility",
    category: "analytics",
    discipline: "Data Analytics",
    title: "Make sales-funnel drop-off visible",
    problem: "Lead totals do not show where prospects stall or how conversion differs across acquisition sources and customer segments.",
    solution: "Model consistent funnel stages and compare stage-to-stage conversion by source and segment, with date filters for review.",
    outputs: ["Funnel chart by stage", "Conversion comparison by source", "Segment and period filters"],
  },
  {
    id: "analytics-demand-and-inventory",
    category: "analytics",
    discipline: "Data Analytics",
    title: "Connect demand patterns to inventory decisions",
    problem: "Sales and stock data are reviewed separately, so demand shifts and inventory exposure are difficult to spot early.",
    solution: "Combine item-level sales and stock snapshots, then compare demand trends, stock coverage, and turnover over consistent periods.",
    outputs: ["Demand trend charts", "Stock-coverage and turnover views", "Low-stock and slow-moving item table"],
  },
  {
    id: "analytics-service-delivery-bottlenecks",
    category: "analytics",
    discipline: "Data Analytics",
    title: "Find service-delivery bottlenecks",
    problem: "A total ticket count hides changes in backlog age, resolution time, and workload across service categories.",
    solution: "Standardize ticket timestamps and statuses, then analyze backlog and resolution patterns by category and time period.",
    outputs: ["Backlog aging chart", "Resolution-time trend and distribution", "Category workload breakdown"],
  },
  {
    id: "analytics-customer-retention-cohorts",
    category: "analytics",
    discipline: "Data Analytics",
    title: "Understand repeat use and customer retention",
    problem: "Aggregate customer totals do not reveal when customers return, where retention changes, or which segments need attention.",
    solution: "Group customers by first-use period and compare repeat activity over time, using consistent definitions for active and retained customers.",
    outputs: ["Cohort-retention heatmap", "Repeat-use trend chart", "Retention breakdown by customer segment"],
  },
  {
    id: "cloud-safe-deployment-pipeline",
    category: "cloud",
    discipline: "Cloud & DevOps",
    title: "Make deployments repeatable and recoverable",
    problem: "Manual releases and inconsistent environments make it hard to review changes, identify failures, and roll back safely.",
    solution: "Use infrastructure as code and a CI/CD pipeline with automated checks, environment-specific configuration, approval gates, and documented rollback steps.",
    outputs: ["Versioned infrastructure and deployment config", "Automated build, test, and release stages", "Rollback and release runbook"],
    cloudServices: [
      {
        name: "Amazon ECR",
        usedFor: "Stores versioned container images built by the delivery pipeline.",
        solution: "Use immutable image tags and lifecycle policies so deployments use traceable, approved builds.",
      },
      {
        name: "Amazon ECS with Fargate",
        usedFor: "Runs containerized application services without managing EC2 hosts.",
        solution: "Configure health checks, service scaling, and deployment rollback for safer releases.",
      },
      {
        name: "AWS IAM",
        usedFor: "Provides identities and permissions to deployment jobs and running tasks.",
        solution: "Separate task and deployment roles, then scope each role to only the required resources and actions.",
      },
    ],
  },
  {
    id: "cloud-observability-reliability",
    category: "cloud",
    discipline: "Cloud & DevOps",
    title: "Improve production visibility and incident response",
    problem: "When an application slows or fails, teams lack correlated telemetry and clear ownership for diagnosis and response.",
    solution: "Establish useful logs, metrics, and traces; define service-level indicators; route actionable alerts; and document incident roles and recovery steps.",
    outputs: ["Service health and latency dashboards", "Alert thresholds and ownership", "Incident response and recovery runbooks"],
    cloudServices: [
      {
        name: "Amazon CloudWatch",
        usedFor: "Collects application logs, infrastructure metrics, and alarms.",
        solution: "Create service dashboards and actionable alerts tied to agreed health and latency thresholds.",
      },
      {
        name: "AWS X-Ray",
        usedFor: "Traces requests across instrumented application components.",
        solution: "Use trace timelines and service maps to narrow down slow or failing dependencies.",
      },
      {
        name: "AWS Backup",
        usedFor: "Schedules and manages recovery points for supported AWS resources.",
        solution: "Set retention policies and regularly test restores against recovery objectives.",
      },
    ],
  },
  {
    id: "cloud-infrastructure-governance",
    category: "cloud",
    discipline: "Cloud & DevOps",
    title: "Control infrastructure drift, access, and spend",
    problem: "Untracked environments, broad permissions, and inconsistent resource ownership increase operational and security risk.",
    solution: "Standardize environment provisioning, apply least-privilege access, tag resources, review budgets, and test backup and recovery procedures.",
    outputs: ["Infrastructure-as-code baseline", "Access and environment review checklist", "Cost, backup, and recovery controls"],
    cloudServices: [
      {
        name: "AWS IAM Identity Center",
        usedFor: "Manages workforce access to AWS accounts and supported applications.",
        solution: "Assign role-based permission sets, require MFA, and remove standing administrator access where possible.",
      },
      {
        name: "AWS Config",
        usedFor: "Records resource configuration and evaluates it against selected rules.",
        solution: "Use configuration rules to identify drift from security and operations baselines.",
      },
      {
        name: "AWS Budgets and Cost Explorer",
        usedFor: "Reviews cloud spend, allocation, trends, and forecasted cost.",
        solution: "Apply ownership tags, budget thresholds, and alerts to surface unexpected spend early.",
      },
      {
        name: "AWS KMS",
        usedFor: "Creates and controls encryption keys used by supported AWS services.",
        solution: "Restrict key policies and access paths, and align rotation and auditing with the security policy.",
      },
    ],
  },
  {
    id: "marketing-content-system",
    category: "digital-marketing",
    discipline: "Digital Marketing",
    title: "Create a consistent social content system",
    problem: "Posting is irregular and content topics are disconnected from audience questions and business priorities.",
    solution: "Define content pillars, map them to audience needs, and plan a reusable calendar with platform-appropriate formats and review ownership.",
    outputs: ["Audience and content-pillar outline", "Channel-specific publishing calendar", "Content review and reuse workflow"],
  },
  {
    id: "marketing-campaign-conversion",
    category: "digital-marketing",
    discipline: "Digital Marketing",
    title: "Connect campaign attention to a clear next step",
    problem: "Campaign posts generate attention but send audiences to generic pages without a focused offer or measurable conversion path.",
    solution: "Align the audience, message, call to action, and landing-page content, then use tagged links and controlled creative tests to compare engagement.",
    outputs: ["Campaign message and audience brief", "Focused landing-page and call-to-action plan", "UTM and creative-test measurement plan"],
  },
  {
    id: "marketing-social-lead-follow-up",
    category: "digital-marketing",
    discipline: "Digital Marketing",
    title: "Turn social enquiries into trackable follow-up",
    problem: "Questions and enquiries arrive through multiple social channels, but ownership and follow-up are difficult to track.",
    solution: "Set clear response pathways, capture consented lead details through suitable forms, and define a handoff and follow-up process.",
    outputs: ["Channel response and escalation guide", "Lead-capture and CRM handoff flow", "Source and follow-up tracking view"],
  },
  {
    id: "cybersecurity-identity-access",
    category: "cybersecurity",
    discipline: "Cybersecurity",
    title: "Reduce identity and access exposure",
    problem: "Access accumulates as people change roles, shared accounts persist, and privileged permissions are not reviewed consistently.",
    solution: "Inventory identities, apply role-based least privilege and MFA, formalize joiner-mover-leaver steps, and schedule privileged-access reviews.",
    outputs: ["Identity and privileged-access inventory", "MFA and role-based access baseline", "Access review and offboarding checklist"],
  },
  {
    id: "cybersecurity-detection-response",
    category: "cybersecurity",
    discipline: "Cybersecurity",
    title: "Prepare a coordinated security response",
    problem: "Security signals are spread across systems, leaving teams uncertain about what to investigate and how to preserve evidence.",
    solution: "Prioritize log sources and alert scenarios, assign response roles, and document containment, escalation, communications, and recovery steps.",
    outputs: ["Logging and alert-use-case plan", "Incident severity and escalation matrix", "Response and evidence-handling runbooks"],
  },
  {
    id: "cybersecurity-application-hardening",
    category: "cybersecurity",
    discipline: "Cybersecurity",
    title: "Strengthen application and cloud security controls",
    problem: "Security checks happen late, while vulnerable dependencies, exposed secrets, and configuration risks can reach production.",
    solution: "Add threat modeling and secure configuration review to delivery, scan dependencies and secrets, and define a prioritized patch and remediation process.",
    outputs: ["Threat-model and security-review checklist", "Dependency, secret, and configuration checks", "Risk-ranked remediation workflow"],
  },
];