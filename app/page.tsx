import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, HeartPulse, ShieldCheck, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const phases = [
    {
        title: "Connection",
        objective: "I feel seen and welcomed.",
        icon: UserCircle,
        desc: "Establish the foundation. Map your neurodiversity and leadership triage.",
        chips: ["Foundation Video", "Getting to Know You", "Your Triage", "Schedule Orientation"],
        filled: true,
    },
    {
        title: "Awareness",
        objective: "I see my life clearly now.",
        icon: HeartPulse,
        desc: "360° evaluations and growth inputs to identify historical blocks.",
        chips: ["360° Evaluation", "Growth Inputs", "Evening Pulse"],
        filled: false,
    },
    {
        title: "Stabilization",
        objective: "I am stepping into the life I desire.",
        icon: ShieldCheck,
        desc: "Create your Ideal Day Narrative and activate your family mission.",
        chips: ["Vision Activation", "Vision Statements", "Ideal Day Story"],
        filled: true,
    },
    {
        title: "Activation",
        objective: "I am fully activated and supported.",
        icon: Zap,
        desc: "Full pro-team support and community activation for wealth and legacy.",
        chips: ["Kickstart Call", "Join Telegram", "Wealth Strategy"],
        filled: false,
    },
]

const features = [
    "Personalized at every step",
    "Guided by experts",
    "Track your progress in real-time",
    "Unlock phases as you grow",
    "Built for leaders, not followers",
]

export default function Page() {
    return (
        <div className="relative min-h-screen bg-background overflow-hidden font-sans text-foreground">
            {/* Ambient background: asymmetric glow + film grain, not a repeating tech pattern */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-40 -right-24 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[130px]" />
                <div className="absolute top-[55%] -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[150px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
                <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay" aria-hidden="true">
                    <filter id="grain">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grain)" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 py-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="relative w-9 h-9 md:w-10 md:h-10">
                        <Image
                            src="/assets/logo.png"
                            alt="Peace-Driven Leader Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-serif text-lg md:text-xl font-medium tracking-tight text-foreground whitespace-nowrap">
                        The Peace-Driven Leader
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                    <Link href="/login" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Sign In
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="sm" className="rounded-lg md:rounded-xl border-border bg-secondary/20 backdrop-blur-sm hover:bg-secondary/30 text-xs md:text-base">
                            Join
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </nav>

            <main className="relative z-10 px-4 md:px-6 pt-8 md:pt-16 pb-40 max-w-6xl mx-auto space-y-28 md:space-y-36">
                {/* Hero Section */}
                <section className="text-center space-y-7 md:space-y-9 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-semibold text-primary/90 uppercase tracking-[0.2em]">
                        <span className="h-px w-6 bg-primary/40" />
                        The Path to Peace-Driven Leadership
                        <span className="h-px w-6 bg-primary/40" />
                    </div>

                    <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] md:leading-[1.05]">
                        Activate Your{" "}
                        <span className="italic text-primary">
                            Inner Mastery
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Transition from burnout to breakthrough. Our proprietary pathway maps your Mind, Body, and Divine Identity to establish peace across every domain.
                    </p>

                    <p className="font-serif italic text-sm md:text-base text-primary/70">
                        &ldquo;You no longer have to carry everything alone.&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
                        <Link href="/login" className="w-full sm:w-auto">
                            <InteractiveHoverButton className="h-12 md:h-14 px-8 md:px-10 text-base md:text-lg w-full">
                                Start Your Pathway
                            </InteractiveHoverButton>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button variant="ghost" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover:bg-secondary/20 gap-2 text-muted-foreground w-full">
                                Sign In <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Four Phases Section */}
                <section className="space-y-12 md:space-y-16">
                    <div className="text-center space-y-3 max-w-xl mx-auto">
                        <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            <span className="h-px w-5 bg-border" />
                            The Pathway
                            <span className="h-px w-5 bg-border" />
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight">
                            Four Phases to <span className="italic text-primary">Breakthrough</span>
                        </h2>
                        <p className="text-muted-foreground">
                            A step-by-step evolution designed to deconstruct chaos and rebuild your baseline for sustainable excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6">
                        {phases.map((item, i) => (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-3xl border border-border/60 p-4 sm:p-6 md:p-8 transition-all duration-500 md:hover:-translate-y-1.5 ${
                                    item.filled ? "bg-primary/[0.06]" : "bg-card/20"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-3 right-1 select-none font-serif text-7xl sm:text-8xl md:text-9xl font-medium text-primary/[0.06] group-hover:text-primary/10 transition-colors"
                                >
                                    0{i + 1}
                                </span>

                                <div className="relative z-10 space-y-2.5 sm:space-y-3">
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" strokeWidth={1.5} />
                                    <h3 className="font-serif text-xl md:text-2xl font-medium">{item.title}</h3>
                                    <p className="font-serif italic text-sm text-primary/80">
                                        &ldquo;{item.objective}&rdquo;
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                    <p className="pt-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 leading-relaxed">
                                        {item.chips.join("  ·  ")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Journey Section */}
                <section className="space-y-10 md:space-y-14">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-3 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            <span className="h-px w-5 bg-border" />
                            How It Works
                            <span className="h-px w-5 bg-border" />
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight">
                            Your <span className="italic text-primary">Journey</span>
                        </h2>
                    </div>

                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute left-5 top-2 bottom-2 w-px">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/15 to-transparent" />
                            <div className="journey-travel absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_3px_var(--primary)]" />
                        </div>
                        <div className="space-y-9">
                            {phases.map((item, i) => (
                                <div key={i} className="relative flex items-start gap-5">
                                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background font-serif text-sm text-primary">
                                        {i + 1}
                                    </div>
                                    <div className="space-y-1 pt-1.5">
                                        <h4 className="flex items-center gap-2 font-semibold">
                                            <item.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="max-w-2xl mx-auto text-center font-serif italic text-base md:text-lg text-muted-foreground leading-relaxed px-4">
                        {features.map((feature, i) => (
                            <span key={feature}>
                                {feature}
                                {i < features.length - 1 && (
                                    <span className="mx-2.5 md:mx-3 not-italic text-primary/50">·</span>
                                )}
                            </span>
                        ))}
                    </p>
                </section>

                {/* Final CTA */}
                <section className="relative p-8 md:p-24 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary/15 via-card/40 to-background border border-border overflow-hidden text-center space-y-5 md:space-y-6">
                    <div className="relative z-10 space-y-4">
                        <p className="font-serif italic text-sm md:text-base text-primary/70">
                            &ldquo;We&rsquo;re not rushing. We&rsquo;re aligning.&rdquo;
                        </p>
                        <h2 className="font-serif text-3xl md:text-6xl font-medium tracking-tight leading-tight">
                            Your Legacy Begins <span className="italic text-primary">with Peace</span>.
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto">
                            The pathway is open. Are you ready to activate your potential?
                        </p>
                        <div className="pt-4 md:pt-6">
                            <Link href="/login" className="inline-block w-full sm:w-auto">
                                <InteractiveHoverButton className="h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl shadow-2xl shadow-primary/40 w-full sm:w-auto">
                                    Apply to Join
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 px-8 py-14 border-t border-border/50 text-center text-sm">
                <p className="text-muted-foreground">© {new Date().getFullYear()} Minesha. All rights reserved.</p>
                <div className="flex items-center justify-center gap-6 mt-4 text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
                </div>
            </footer>
        </div>
    )
}
