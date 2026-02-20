import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Mic,
  Brain,
  BarChart3,
  Sparkles,
  Shield,
  Rocket,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-background text-text min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* ===== Navbar ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : ""
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
            InterviewArc
          </div>

          <div className="hidden md:flex gap-12 text-sm text-text-secondary">
            <a href="#problems" className="hover:text-text transition">Problems</a>
            <a href="#features" className="hover:text-text transition">Features</a>
            <a href="#trust" className="hover:text-text transition">Why Us</a>
          </div>

          <div className="hidden md:flex gap-4">
            <button className="text-text-secondary hover:text-text transition">Sign In</button>
            <button className="bg-gradient-to-r from-primary to-primary-light px-5 py-2 rounded-full text-sm font-semibold hover:shadow-md-glass transition">
              Start Free
            </button>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border">
            <div className="flex flex-col items-center gap-6 py-10 text-text-secondary">
              <a href="#problems">Problems</a>
              <a href="#features">Features</a>
              <a href="#trust">Why Us</a>
              <button className="bg-gradient-to-r from-primary to-primary-light px-6 py-2 rounded-full text-text text-sm font-semibold w-32">Start Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="pt-32 pb-28 px-6 text-center relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-full text-sm text-primary mb-8 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>Adaptive AI Interview Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Master Interviews<br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">with AI</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice adaptive mock interviews powered by AI. Get real-time feedback, build confidence, and land your dream role with data-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="bg-gradient-to-r from-primary to-primary-light px-8 py-4 rounded-full font-semibold hover:shadow-md-glass hover:scale-105 transition flex items-center justify-center gap-2 group">
              Start Interview
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </button>

            <button className="border border-border px-8 py-4 rounded-full font-semibold hover:bg-surface transition">
              Watch Demo
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-text-tertiary">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent"></div>
              </div>
              <span>2,500+ professionals improved</span>
            </div>
            <div>•</div>
            <div>98% interview success rate</div>
          </div>
        </div>
      </section>

      {/* ===== Problems Section ===== */}
      <section id="problems" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase mb-3">Interview Challenges</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Interview anxiety is real. <span className="text-text-secondary">We fix it.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProblemCard
              icon={<AlertCircle />}
              title="Static Questions"
              description="Generic interview prep doesn't match your role"
            />
            <ProblemCard
              icon={<Brain />}
              title="Anxiety & Uncertainty"
              description="No way to practice without judgment"
            />
            <ProblemCard
              icon={<BarChart3 />}
              title="No Real Feedback"
              description="Hard to know what to actually improve"
            />
            <ProblemCard
              icon={<TrendingUp />}
              title="Inconsistent Growth"
              description="Lack of structured progress tracking"
            />
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-primary text-sm font-semibold uppercase mb-3">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black">
              Everything you need to ace interviews
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap />}
              title="Resume-Aware AI"
              description="Questions tailored to your experience and target role"
              highlight
            />
            <FeatureCard
              icon={<Brain />}
              title="Adaptive Difficulty"
              description="Questions adjust based on your performance in real-time"
            />
            <FeatureCard
              icon={<Mic />}
              title="Voice Interviews"
              description="Practice with speech recognition and natural conversation"
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Performance Analytics"
              description="Detailed insights on communication, clarity, and confidence"
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Growth Tracking"
              description="See your progress over time with visual dashboards"
            />
            <FeatureCard
              icon={<Sparkles />}
              title="AI Feedback"
              description="Actionable improvement tips powered by advanced AI"
            />
          </div>
        </div>
      </section>

      {/* ===== Trust Section ===== */}
      <section id="trust" className="py-28 px-6 bg-surface/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <StatCard number="98%" label="Interview Success Rate" />
            <StatCard number="2.5K+" label="Active Users" />
            <StatCard number="4.9★" label="Average Rating" />
          </div>

          <div className="bg-surface border border-border rounded-3xl p-12 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-8">Why professionals choose InterviewArc</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <BenefitItem title="No Judgment Zone" description="Practice freely without pressure or evaluation anxiety" />
                <BenefitItem title="Instant Feedback" description="Get detailed analysis right after each interview" />
                <BenefitItem title="24/7 Availability" description="Practice whenever you want, as many times as needed" />
              </div>
              <div className="space-y-6">
                <BenefitItem title="Industry Experts" description="Questions reviewed by hiring managers and interviewers" />
                <BenefitItem title="Data-Driven" description="Track progress with comprehensive analytics" />
                <BenefitItem title="Affordable" description="Premium features at a fraction of hiring coach costs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to crack your next interview?
          </h2>
          <p className="text-xl text-text-secondary mb-10">
            Join thousands of professionals landing their dream roles
          </p>
          <button className="bg-gradient-to-r from-primary to-primary-light px-10 py-4 rounded-full text-lg font-bold hover:shadow-md-glass hover:scale-105 transition inline-flex items-center gap-3">
            Start Your First Interview
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-surface/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-primary to-accent rounded"></div>
                InterviewArc
              </h3>
              <p className="text-sm text-text-secondary">
                AI-powered interview prep platform helping professionals build confidence and land their dream roles.
              </p>
            </div>

            <FooterColumn title="Product" links={["Features", "Pricing", "FAQ", "Roadmap"]} />
            <FooterColumn title="Company" links={["About", "Blog", "Careers", "Contact"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms", "Security", "Cookies"]} />
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-tertiary">
            <p>© 2026 InterviewArc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-text transition">Twitter</a>
              <a href="#" className="hover:text-text transition">LinkedIn</a>
              <a href="#" className="hover:text-text transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== Reusable Components ===== */

function ProblemCard({ icon, title, description }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
      <div className="text-primary mb-4 group-hover:scale-110 transition">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight }) {
  return (
    <div className={`rounded-2xl border p-8 transition group ${
      highlight 
        ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/50 md:col-span-1 md:row-span-2 flex flex-col justify-center"
        : "bg-surface border-border hover:border-border-light"
    }`}>
      <div className={`mb-4 ${highlight ? 'text-3xl' : ''} group-hover:scale-110 transition`}>{icon}</div>
      <h3 className={`font-semibold mb-2 ${highlight ? 'text-xl' : 'text-lg'}`}>{title}</h3>
      <p className={`text-text-secondary ${highlight ? 'text-base' : 'text-sm'}`}>{description}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-8 text-center">
      <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
}

function BenefitItem({ title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <CheckCircle size={24} className="text-accent mt-1" />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-text-secondary">{title}</h4>
      <div className="flex flex-col gap-3 text-sm text-text-tertiary">
        {links.map((link) => (
          <a key={link} href="#" className="hover:text-text transition">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
