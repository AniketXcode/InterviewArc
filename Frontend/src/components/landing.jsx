import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Mic,
  Brain,
  BarChart3,
  Sparkles,
  Shield,
  Rocket
} from "lucide-react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen">

      {/* ===== Navbar ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
          : ""
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ◆ InterviewArc
          </div>

          <div className="hidden md:flex gap-8 text-sm text-white/60">
            <a href="#how" className="hover:text-white">How It Works</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#why" className="hover:text-white">Why Us</a>
          </div>

          <button onClick={() => navigate('/login')} className="hidden md:block bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Get Started
          </button>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="flex flex-col items-center gap-6 py-10 text-white/70">
              <a href="#how">How It Works</a>
              <a href="#features">Features</a>
              <a href="#why">Why Us</a>
            </div>
          </div>
        )}
      </nav>

      {/* ===== Hero ===== */}
      <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">

        {/* Floating Glow Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-4xl mx-auto relative">

          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full text-sm text-blue-300 mb-6 backdrop-blur-xl">
            <Sparkles size={14} /> AI-Powered Interview Prep
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Ace Your Interviews <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>

          <p className="text-white/60 max-w-xl mx-auto mb-10">
            Practice real interview questions with intelligent AI feedback.
            Build confidence and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-xl font-medium hover:scale-105 transition">
              Start Free Interview
            </button>

            <button onClick={() => navigate('/login')} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <TiltCard>
              <Card icon={<Brain />} title="Choose Your Role">
                Select from multiple job roles and domains.
              </Card>
            </TiltCard>

            <TiltCard>
              <Card icon={<Mic />} title="AI Takes Interview">
                Answer via voice or text in real-time.
              </Card>
            </TiltCard>

            <TiltCard>
              <Card icon={<BarChart3 />} title="Get Feedback">
                Receive score and improvement tips instantly.
              </Card>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm mb-2">Powerful Tools</p>
            <h2 className="text-3xl font-bold">Features</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TiltCard><Feature title="Smart AI Questions" /></TiltCard>
            <TiltCard><Feature title="Real-Time Feedback" /></TiltCard>
            <TiltCard><Feature title="Performance Score" /></TiltCard>
          </div>
        </div>
      </section>

      {/* ===== Why Us ===== */}
      <section id="why" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold">Why InterviewArc</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <TiltCard>
              <Card icon={<Shield />} title="No Pressure">
                Safe and judgment-free practice.
              </Card>
            </TiltCard>

            <TiltCard>
              <Card icon={<Rocket />} title="Boost Confidence">
                Track progress and improve fast.
              </Card>
            </TiltCard>

            <TiltCard>
              <Card icon={<Sparkles />} title="Practice Anytime">
                No scheduling, no limits.
              </Card>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to crack your next interview?
          </h2>

          <button onClick={() => navigate('/register')} className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-xl font-medium hover:scale-105 transition">
            Get Started Free
          </button>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-16">

          <div className="grid md:grid-cols-4 gap-10">

            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ◆ InterviewArc
              </h3>
              <p className="text-sm text-white/50 mt-4">
                AI-powered interview preparation platform helping you build confidence and crack interviews.
              </p>
            </div>

            <FooterColumn title="Product" links={["Features", "Pricing", "Roadmap"]} />
            <FooterColumn title="Company" links={["About", "Careers", "Contact"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms", "Cookies"]} />

          </div>

          <div className="border-t border-white/10 mt-10 pt-6 text-sm text-white/40 text-center">
            © 2026 InterviewArc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ===== Reusable Components ===== */

function TiltCard({ children }) {
  return (
    <div className="transition-transform duration-500 hover:scale-105 hover:-translate-y-1 hover:rotate-1">
      {children}
    </div>
  );
}

function Card({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/60">{children}</p>
    </div>
  );
}

function Feature({ title }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-white/60 mt-2">
        Beautiful AI-powered experience.
      </p>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-4 text-white/80">{title}</h4>
      <div className="flex flex-col gap-2 text-sm text-white/50">
        {links.map((link) => (
          <a key={link} href="#" className="hover:text-white">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
