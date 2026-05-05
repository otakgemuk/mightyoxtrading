import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";
import {
  BarChart3,
  Calculator,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Users,
  Building2,
  BadgeCheck,
  Quote,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const howItWorks = [
  {
    icon: BarChart3,
    title: "Compare",
    description:
      "Side-by-side comparison of account sizes, prices, profit targets, drawdown rules, and payout structures.",
  },
  {
    icon: Calculator,
    title: "Calculate",
    description:
      "ROI calculator shows your true cost and profit potential. Consistency calculators check if you meet each firm's unique requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Succeed",
    description:
      "Know exactly what rules to follow and which countries are accepted before you ever spend a dollar.",
  },
];

export default function Home() {
  const { data: firms } = trpc.propFirm.list.useQuery({});

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-mesh overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4AA]/10 text-[#00D4AA] text-xs font-semibold uppercase tracking-wider">
                  Futures Prop Firm Intelligence
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#F1F2F6]"
              >
                Find the Perfect{" "}
                <span className="text-[#00D4AA]">Prop Firm.</span>{" "}
                Maximize Your Payout.
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-lg text-[#8B92A8] max-w-xl leading-relaxed"
              >
                Compare 50+ futures prop firms side-by-side. Calculate ROI, check
                country eligibility, and avoid costly rule violations — all in
                one place.
              </motion.p>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-wrap gap-4"
              >
                <Link to="/compare">
                  <Button
                    size="lg"
                    className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold px-6"
                  >
                    Compare Firms
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/calculators">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#00D4AA]/50 text-[#00D4AA] hover:bg-[#00D4AA]/10 px-6"
                  >
                    Try Consistency Calculator
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex items-center gap-6 text-sm text-[#8B92A8] pt-4"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00D4AA]" />
                  <span>8+ Firms Compared</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00D4AA]" />
                  <span>15,000+ Traders Helped</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#00D4AA]" />
                  <span>100% Free</span>
                </div>
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Abstract geometric shapes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full bg-[#00D4AA]/5 border border-[#00D4AA]/20 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-60 h-60 rounded-full bg-[#00D4AA]/8 border border-[#00D4AA]/30" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/40 rotate-45" />
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-10 right-10 bg-[#1A1F2E] border border-[#2A3040] rounded-xl p-4 shadow-xl"
                >
                  <div className="text-[#00D4AA] font-bold text-lg">287%</div>
                  <div className="text-xs text-[#8B92A8]">Avg ROI</div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                  className="absolute bottom-16 left-10 bg-[#1A1F2E] border border-[#2A3040] rounded-xl p-4 shadow-xl"
                >
                  <div className="text-[#FFB800] font-bold text-lg">$5,000</div>
                  <div className="text-xs text-[#8B92A8]">Profit Target</div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
                  className="absolute top-1/2 right-0 bg-[#1A1F2E] border border-[#2A3040] rounded-xl p-4 shadow-xl"
                >
                  <div className="text-[#00D4AA] font-bold text-lg">90/10</div>
                  <div className="text-xs text-[#8B92A8]">Split</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#1A1F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-[#F1F2F6] mb-3">
              How It Works
            </h2>
            <p className="text-[#8B92A8] max-w-xl mx-auto">
              Three simple steps to find your ideal prop firm
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="bg-[#0A0E1A] border-[#2A3040] hover:border-[#00D4AA]/40 transition-colors h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#00D4AA]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#F1F2F6]">
                      {item.title}
                    </h3>
                    <p className="text-[#8B92A8] leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Firms */}
      <section className="py-20 bg-[#0A0E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#F1F2F6] mb-2">
                Popular Firm Comparisons
              </h2>
              <p className="text-[#8B92A8]">
                Quick snapshot of top-rated prop firms
              </p>
            </div>
            <Link
              to="/compare"
              className="hidden sm:flex items-center gap-1 text-[#00D4AA] hover:text-[#00B894] font-medium text-sm"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {firms?.slice(0, 4).map((firm, i) => (
              <motion.div
                key={firm.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/compare/${firm.slug}`}>
                  <Card className="bg-[#1A1F2E] border-[#2A3040] hover:border-[#00D4AA]/40 transition-all hover:-translate-y-1 h-full">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-bold text-sm">
                          {firm.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-lg font-bold text-[#00D4AA]">
                          ${firm.minPrice}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#F1F2F6] text-sm truncate">
                        {firm.name}
                      </h3>
                      {firm.products[0] && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[#0A0E1A] rounded-lg p-2">
                            <div className="text-xs text-[#8B92A8]">Target</div>
                            <div className="text-xs font-semibold text-[#F1F2F6]">
                              {firm.products[0].profitTarget}%
                            </div>
                          </div>
                          <div className="bg-[#0A0E1A] rounded-lg p-2">
                            <div className="text-xs text-[#8B92A8]">DD</div>
                            <div className="text-xs font-semibold text-[#F1F2F6]">
                              {firm.products[0].dailyDrawdown}%
                            </div>
                          </div>
                          <div className="bg-[#0A0E1A] rounded-lg p-2">
                            <div className="text-xs text-[#8B92A8]">Max</div>
                            <div className="text-xs font-semibold text-[#F1F2F6]">
                              {firm.products[0].maxDrawdown}%
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-[#00D4AA] text-xs font-medium">
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-20 bg-[#1A1F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0A0E1A] border border-[#2A3040] rounded-2xl p-6 space-y-4"
            >
              <div className="text-xs text-[#8B92A8] uppercase tracking-wider font-medium">
                ROI Calculator
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8B92A8]">Account Price</label>
                  <div className="bg-[#1A1F2E] border border-[#2A3040] rounded-lg px-3 py-2 text-sm text-[#F1F2F6]">
                    $167.00
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8B92A8]">Account Size</label>
                  <div className="bg-[#1A1F2E] border border-[#2A3040] rounded-lg px-3 py-2 text-sm text-[#F1F2F6]">
                    $50,000
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8B92A8]">Monthly Return</label>
                  <div className="bg-[#1A1F2E] border border-[#2A3040] rounded-lg px-3 py-2 text-sm text-[#F1F2F6]">
                    8%
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8B92A8]">Months</label>
                  <div className="bg-[#1A1F2E] border border-[#2A3040] rounded-lg px-3 py-2 text-sm text-[#F1F2F6]">
                    6
                  </div>
                </div>
              </div>
              <div className="border-t border-[#2A3040] pt-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#00D4AA]">287%</div>
                  <div className="text-xs text-[#8B92A8]">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#F1F2F6]">$2,880</div>
                  <div className="text-xs text-[#8B92A8]">Net Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#FFB800]">1.2</div>
                  <div className="text-xs text-[#8B92A8]">Break-even</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-[#F1F2F6] mb-4">
                  Built-In Trader Tools
                </h2>
                <p className="text-[#8B92A8] leading-relaxed">
                  Everything you need to evaluate and compare prop firms before
                  making a purchase decision.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Calculator,
                    title: "ROI Calculator",
                    desc: "See true return on every account purchase",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Consistency Calculator",
                    desc: "Verify you meet firm-specific trading requirements",
                  },
                  {
                    icon: Globe,
                    title: "Country Checker",
                    desc: "Instantly see where each firm accepts traders",
                  },
                  {
                    icon: BarChart3,
                    title: "Rule Explorer",
                    desc: "Avoid payout invalidation with detailed rule breakdowns",
                  },
                ].map((tool) => (
                  <div
                    key={tool.title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#0A0E1A] border border-[#2A3040]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center shrink-0">
                      <tool.icon className="w-5 h-5 text-[#00D4AA]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F1F2F6] text-sm">
                        {tool.title}
                      </h4>
                      <p className="text-[#8B92A8] text-sm">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/calculators">
                <Button
                  variant="outline"
                  className="border-[#00D4AA]/50 text-[#00D4AA] hover:bg-[#00D4AA]/10"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0A0E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-[#F1F2F6] mb-3">
              Trusted by Traders Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Saved me from buying an account with a firm that doesn't accept my country. This tool is essential for international traders.",
                name: "Marcus T.",
                country: "Brazil",
              },
              {
                quote:
                  "The ROI calculator helped me realize that the cheapest account isn't always the best value. Found a much better deal.",
                name: "Sarah K.",
                country: "United Kingdom",
              },
              {
                quote:
                  "Consistency calculator caught a rule violation I would have missed. Passed my evaluation on the first try after adjusting my strategy.",
                name: "David L.",
                country: "Canada",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="bg-[#1A1F2E] border-[#2A3040] h-full">
                  <CardContent className="p-6 space-y-4">
                    <Quote className="w-8 h-8 text-[#00D4AA]/30" />
                    <p className="text-[#F1F2F6] text-sm leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] text-xs font-bold">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#F1F2F6]">
                          {t.name}
                        </div>
                        <div className="text-xs text-[#8B92A8]">{t.country}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-b from-[#0A0E1A] to-[#121726">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#1A1F2E] border border-[#2A3040] rounded-2xl p-10 text-center space-y-6 relative overflow-hidden"
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(#00D4AA 1px, transparent 1px), linear-gradient(90deg, #00D4AA 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold text-[#F1F2F6]">
                Ready to Find Your Prop Firm?
              </h2>
              <p className="text-[#8B92A8] max-w-lg mx-auto">
                Create your free account to save comparisons, track your
                favorites, and get notified of new firm launches.
              </p>
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold px-8"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
