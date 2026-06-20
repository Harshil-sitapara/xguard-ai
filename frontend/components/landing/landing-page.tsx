"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Eye,
  GitBranch,
  Lock,
  Network,
  PlayCircle,
  Radar,
  Shield,
  Sparkles,
  SunMoon,
  Waves,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ProofPoint = {
  value: string;
  label: string;
};

type FeatureCard = {
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

type WorkflowStep = {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

const proofPoints: ProofPoint[] = [
  {
    value: "3",
    label: "trained model families",
  },
  {
    value: "1,000",
    label: "flows per batch request",
  },
  {
    value: "REST + WS",
    label: "history and live delivery",
  },
  {
    value: "API Key",
    label: "protected service access",
  },
];

const featureCards: FeatureCard[] = [
  {
    eyebrow: "Live operations",
    title: "Analyst dashboard",
    description:
      "Track packet volume, attack counts, connection status, and traffic distribution from one screen.",
    detail:
      "Security teams can move from live monitoring to packet-level review without switching context.",
    icon: Radar,
  },
  {
    eyebrow: "Explainability",
    title: "SHAP-backed incident review",
    description:
      "Open any prediction and inspect the features that pushed the model toward benign or malicious classification.",
    detail:
      "That gives analysts a reasoned trail instead of a raw confidence score alone.",
    icon: Eye,
  },
  {
    eyebrow: "Validation",
    title: "Traffic simulation tools",
    description:
      "Upload raw network traffic data from the UI to simulate live conditions and exercise the production detection pipeline.",
    detail:
      "It is useful for validating historical flows, smoke testing, and analyzing held-out datasets at scale.",
    icon: PlayCircle,
  },
  {
    eyebrow: "Detection engine",
    title: "Multi-model ML foundation",
    description:
      "The repository trains Random Forest, XGBoost, and LSTM models, with XGBoost serving production inference.",
    detail:
      "That keeps the system fast enough for streaming use while preserving explainability.",
    icon: Cpu,
  },
  {
    eyebrow: "Secure delivery",
    title: "Secured analyst operations",
    description:
      "Prediction, explanation, alert history, and CSV upload tools are protected with API-key access, while health checks stay simple for operations.",
    detail:
      "That keeps the operational control plane protected while preserving simple service health verification.",
    icon: Lock,
  },
  {
    eyebrow: "Architecture",
    title: "Streaming loop from data to action",
    description:
      "Kafka ingestion, FastAPI inference, PostgreSQL persistence, and a Next.js frontend work together as one workflow.",
    detail:
      "The platform is built to connect detection, persistence, and analyst visibility in one production-oriented path.",
    icon: GitBranch,
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: "Upload network logs (CSV)",
    description:
      "Submit raw network logs through the interface. The system reads the CSV, queues the flows into Kafka, and begins real-time processing.",
    detail: "This allows you to simulate high-volume network traffic seamlessly using historical datasets.",
    icon: Network,
  },
  {
    title: "Classify with the serving model",
    description:
      "The backend applies the production inference service and returns label, severity, and confidence.",
    detail: "The current repo serves XGBoost for the main runtime path.",
    icon: Zap,
  },
  {
    title: "Persist and broadcast results",
    description:
      "Predictions are stored for history views while live alerts are pushed to the analyst UI over WebSocket.",
    detail: "The same app provides both retrospective context and real-time awareness.",
    icon: Database,
  },
  {
    title: "Explain and investigate",
    description:
      "Analysts can open SHAP explanations to understand the top features driving each decision.",
    detail: "That closes the loop between detection quality and reviewer trust.",
    icon: Workflow,
  },
];

const stackItems = [
  "Next.js dashboard",
  "FastAPI inference",
  "Kafka streaming",
  "PostgreSQL persistence",
  "XGBoost production scoring",
  "LSTM + Random Forest research baselines",
  "SHAP explainability",
  "Docker-based local setup",
] as const;

const benefitItems = [
  "Real-time WebSocket updates keep analysts aware of changing traffic conditions.",
  "SHAP-backed review improves trust in automated decisions before escalation.",
  "CSV log upload controls help simulate live traffic, enabling robust testing and validation.",
  "Light and dark modes support different analyst environments without changing workflows.",
] as const;

const navItems = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#workflow", label: "Workflow" },
  { href: "#architecture", label: "Architecture" },
] as const;

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useEffectEvent(() => {
    setIsScrolled(window.scrollY > 16);
  });
  const handleDashboardClick = useEffectEvent((placement: string) => {
    void trackEvent("landing_dashboard_cta_click", { placement });
  });

  const revealSections = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  });

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const observer = new IntersectionObserver(revealSections, {
      threshold: 0.18,
      rootMargin: "0px 0px -12% 0px",
    });

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="landing-shell relative overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[46rem] overflow-hidden">
        <div className="landing-grid absolute inset-0 opacity-70 dark:opacity-80" />
        <div className="landing-orb absolute left-[-10rem] top-24 h-[22rem] w-[22rem] rounded-full bg-cyan-400/18 blur-3xl dark:bg-cyan-400/10" />
        <div
          className="landing-orb absolute right-[-8rem] top-16 h-[20rem] w-[20rem] rounded-full bg-emerald-300/18 blur-3xl dark:bg-emerald-300/10"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="landing-orb absolute bottom-10 left-1/3 h-[18rem] w-[18rem] rounded-full bg-sky-400/14 blur-3xl dark:bg-sky-400/8"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isScrolled
            ? "border-b border-slate-200/70 bg-white/75 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/brand/log_with_name.png"
              alt="XGuard AI"
              width={508}
              height={164}
              priority
              className="brand-logo h-auto w-[155px] object-contain sm:w-[190px] lg:w-[220px]"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <Link
                href="/dashboard"
                onClick={() => handleDashboardClick("header")}
              >
                Open Dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-36">
        <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-[minmax(0,0.98fr)_minmax(460px,1.02fr)]">
          <div data-reveal className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-cyan-900/60 dark:bg-slate-900/75 dark:text-slate-200">
              <Sparkles className="size-4 text-cyan-600 dark:text-cyan-300" />
              AI IDS platform
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
              Explainable AI defense,
              <span className="mt-2 block bg-gradient-to-r from-slate-950 via-cyan-700 to-emerald-600 bg-clip-text text-transparent dark:from-white dark:via-cyan-300 dark:to-emerald-300">
                built for network traffic analysis.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              XGuard AI combines streaming Kafka ingestion, FastAPI inference,
              SHAP explainability, alert history, and analyst-friendly
              monitoring in one AI intrusion detection system. It is designed to
              help teams detect malicious traffic quickly, understand why the
              model fired, and review incidents through a polished light or dark
              mode interface.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/65 p-4 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
                <span>
                  Live packet feed with alert counts, distribution charts, and
                  stream health in one analyst workspace.
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/65 p-4 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
                <span>
                  SHAP drill-down for explainable incident review on every
                  selected prediction and flagged flow.
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/65 p-4 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
                <span>
                  CSV log upload tools for exercising the backend pipeline with
                  packaged traffic during testing, demos, and validation.
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/65 p-4 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
                <span>
                  Streaming, persistence, and review layers tied together across
                  FastAPI, Kafka, PostgreSQL, and Next.js.
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-cyan-500 px-6 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-24px_rgba(6,182,212,0.65)] hover:bg-cyan-400"
              >
                <Link
                  href="/dashboard"
                  onClick={() => handleDashboardClick("hero_primary")}
                >
                  Launch the analyst dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-slate-300 bg-white/75 px-6 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-900"
              >
                <a href="#capabilities">
                  Explore platform capabilities
                  <ChevronRight className="size-4" />
                </a>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {proofPoints.map((item, index) => (
                <div
                  key={item.label}
                  data-reveal
                  className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/72"
                  style={{ transitionDelay: `${100 + index * 60}ms` }}
                >
                  <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section id="capabilities" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
              Platform capabilities
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Built for teams that need speed, visibility, and explainable decisions.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              XGuard AI brings together model-driven detection, explainability,
              live observability, and secured operations in a platform that can
              support analyst workflows beyond a static demo.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  data-reveal
                  className="group rounded-[2rem] border border-slate-200/80 bg-white/78 p-7 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.3)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_26px_70px_-36px_rgba(34,211,238,0.4)] dark:border-slate-800/80 dark:bg-slate-900/78 dark:hover:border-cyan-800"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700 dark:text-cyan-300">
                        {card.eyebrow}
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {card.title}
                      </h3>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 transition-transform duration-300 group-hover:scale-110 dark:bg-cyan-400/10 dark:text-cyan-300">
                      <Icon className="size-6" />
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {card.description}
                  </p>
                  <p className="mt-5 border-t border-slate-200/80 pt-5 text-sm leading-7 text-slate-500 dark:border-slate-800 dark:text-slate-500">
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-white/90 via-cyan-50/50 to-emerald-50/40 p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800/70 dark:from-slate-900/90 dark:via-slate-900/92 dark:to-slate-950/96 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
          <div data-reveal className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
              Workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              From network traffic to analyst action in four steps.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-400">
              The system is organized around a clear operational path: ingest
              traffic, score it with the serving model, persist alert history,
              and support fast explanation-driven review for analysts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                Kafka + API entry paths
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                PostgreSQL history
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                WebSocket alert fan-out
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  data-reveal
                  className="flex gap-4 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-500">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="architecture" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
              Technology stack
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Modern infrastructure for production deployment and analyst operations.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              XGuard AI combines streaming ingestion, machine-learning
              inference, explainability, persistence, and frontend monitoring
              into a cohesive AI IDS stack.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div data-reveal className="rounded-[2rem] border border-slate-200/80 bg-white/78 p-8 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.4)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/78">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <Shield className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                    Core platform stack
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Technologies behind live detection, persistence, and analyst review.
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stackItems.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div
                data-reveal
                className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-8 text-slate-100 shadow-[0_24px_70px_-42px_rgba(2,132,199,0.5)] dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Activity className="size-5 text-cyan-300" />
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    Operational benefits
                  </p>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  {benefitItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-7 text-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-300" />
                        <span>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                data-reveal
                className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-8 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.35)] dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
              >
                <div className="flex items-center gap-3">
                  <SunMoon className="size-5 text-cyan-700 dark:text-cyan-300" />
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                    Deployment fit
                  </p>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Ready for SOC-style monitoring and explainable review.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  The platform combines a professional dashboard, CSV log
                  simulation, stored alert history, and explainability workflows in
                  an interface that remains comfortable in both light and dark
                  operating environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 p-8 text-white shadow-[0_24px_80px_-42px_rgba(8,145,178,0.55)] sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div data-reveal className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Deploy with confidence
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Monitor traffic, review flagged flows, and explain model decisions from one AI IDS workspace.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/80">
                XGuard AI brings together streaming detection, alert history,
                secure analyst controls, and SHAP-backed explainability for
                teams moving toward production-ready network defense workflows.
              </p>
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                <Link
                  href="/dashboard"
                  onClick={() => handleDashboardClick("cta_banner")}
                >
                  Launch dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10"
              >
                <a href="#workflow">
                  See the workflow
                  <ChevronRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 px-4 py-10 sm:px-6 lg:px-8 dark:border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-600 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/small.png"
              alt="XGuard AI"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span>XGuard AI production-ready AI IDS for explainable network defense.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#capabilities" className="transition-colors hover:text-slate-950 dark:hover:text-white">
              Capabilities
            </a>
            <a href="#architecture" className="transition-colors hover:text-slate-950 dark:hover:text-white">
              Architecture
            </a>
            <Link
              href="/dashboard"
              onClick={() => handleDashboardClick("footer_link")}
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .landing-shell {
          scroll-behavior: smooth;
        }

        .landing-grid {
          background-image:
            linear-gradient(to right, rgba(148, 163, 184, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.16) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), transparent 88%);
          animation: landing-grid-pan 26s linear infinite;
        }

        .dark .landing-grid {
          background-image:
            linear-gradient(to right, rgba(71, 85, 105, 0.28) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71, 85, 105, 0.28) 1px, transparent 1px);
        }

        .landing-orb {
          animation: landing-float 18s ease-in-out infinite;
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes landing-grid-pan {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(64px, 64px, 0);
          }
        }

        @keyframes landing-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.04);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-shell {
            scroll-behavior: auto;
          }

          .landing-shell *,
          .landing-shell *::before,
          .landing-shell *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function HeroPreview() {
  return (
    <div data-reveal className="relative lg:pt-8">
      <div className="absolute inset-8 rounded-[2.5rem] bg-cyan-500/15 blur-3xl dark:bg-cyan-400/8" />

      <div className="relative rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_26px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-slate-950/78 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Analyst Control Center
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-500" />
            Stream active
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PreviewBadge
            icon={Network}
            label="Live stream"
            value="WebSocket + history"
          />
          <PreviewBadge
            icon={Eye}
            label="Explainability"
            value="SHAP enabled"
          />
          <PreviewBadge
            icon={PlayCircle}
            label="Log upload"
            value="CSV simulation"
          />
        </div>

        <div className="mt-5 grid gap-4">
          <div className="min-w-0 rounded-[1.6rem] border border-slate-200/80 bg-gradient-to-br from-white via-cyan-50/55 to-white p-5 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/92 dark:to-slate-950/94 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Explainability review
                </p>
                <p className="mt-3 text-[1.7rem] font-semibold leading-tight text-slate-950 dark:text-white sm:text-[1.95rem]">
                  Trace every high-risk flow with ranked SHAP evidence.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-500">
                  Move from the live queue to the exact drivers behind a prediction without leaving the analyst workspace.
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <Eye className="size-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <PreviewMetric label="Signals ranked" value="3 drivers" />
              <PreviewMetric label="Analyst path" value="Alert to SHAP" />
              <PreviewMetric label="Review state" value="Traceable" />
            </div>

            <div className="mt-5 grid gap-4 2xl:grid-cols-[minmax(0,1.08fr)_250px]">
              <div className="min-w-0 rounded-[1.35rem] border border-slate-200/80 bg-white/92 p-4 text-slate-700 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
                      Selected incident
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      Port Scan
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-500/12 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">
                    92% confidence
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Source
                    </p>
                    <p className="mt-2 font-mono text-sm text-slate-900 dark:text-white">10.0.2.18</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Destination
                    </p>
                    <p className="mt-2 font-mono text-sm text-slate-900 dark:text-white">172.16.0.21</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <FeatureSignal feature="Dst Port" widthClass="w-[86%]" toneClass="bg-rose-400" />
                  <FeatureSignal feature="Flow Bytes/s" widthClass="w-[68%]" toneClass="bg-cyan-300" />
                  <FeatureSignal feature="Packet Length Mean" widthClass="w-[74%]" toneClass="bg-emerald-300" />
                </div>
              </div>

              <div className="min-w-0 rounded-[1.35rem] border border-slate-200/80 bg-white/88 p-4 dark:border-slate-800 dark:bg-slate-950/72">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
                  Packet context
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Open any row to inspect the evidence behind each flagged flow.
                </p>

                <div className="mt-4 space-y-3">
                  <PreviewRow
                    time="14:20:18.228"
                    src="10.0.2.15"
                    dst="172.16.0.9"
                    label="Benign"
                    tone="safe"
                  />
                  <PreviewRow
                    time="14:20:18.413"
                    src="10.0.2.18"
                    dst="172.16.0.21"
                    label="DDoS"
                    tone="attack"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
                    Live feed
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                    218 packets
                  </p>
                </div>
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <Waves className="size-5" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Benign traffic
                    </span>
                    <span className="text-slate-500 dark:text-slate-500">72%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 w-[72%] rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Attack traffic
                    </span>
                    <span className="text-slate-500 dark:text-slate-500">28%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 w-[28%] rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4 dark:border-slate-800 dark:bg-slate-900/72">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Production serving
                </span>
                <Cpu className="size-4 text-cyan-700 dark:text-cyan-300" />
              </div>
              <p className="mt-3 text-xl font-semibold leading-tight text-slate-950 dark:text-white">
                XGBoost live scoring
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-500">
                Fast inference with replay-safe analyst controls and persistent alert history.
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Serving path
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                    FastAPI + model artifacts
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Delivery
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                    WebSocket and stored history
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  Replay and evidence
                </span>
                <Shield className="size-5 text-rose-300" />
              </div>
              <p className="mt-3 text-xl font-semibold leading-tight text-white">
                Validated replay
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Re-run realistic traffic sets to test alerts, workflows, and analyst readiness.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  held-out traffic
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  operator demos
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  validation runs
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function PreviewBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/82 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/72">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-slate-800 dark:bg-slate-950/70">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function PreviewRow({
  time,
  src,
  dst,
  label,
  tone,
}: {
  time: string;
  src: string;
  dst: string;
  label: string;
  tone: "safe" | "attack";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 text-xs dark:border-slate-800 dark:bg-slate-950/80">
      <span className="font-mono text-slate-500 dark:text-slate-500">{time}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-slate-700 dark:text-slate-300">
        {src} <span className="text-slate-400">-&gt;</span> {dst}
      </span>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 font-semibold",
          tone === "safe"
            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
            : "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function FeatureSignal({
  feature,
  widthClass,
  toneClass,
}: {
  feature: string;
  widthClass: string;
  toneClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>{feature}</span>
        <span>feature weight</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10">
        <div className={cn("h-2 rounded-full", widthClass, toneClass)} />
      </div>
    </div>
  );
}
