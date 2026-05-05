import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROICalculator } from "@/components/ROICalculator";
import {
  Star,
  Globe,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FirmProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: firm, isLoading } = trpc.propFirm.getBySlug.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="animate-pulse text-[#8B92A8]">Loading firm data...</div>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Card className="bg-[#1A1F2E] border-[#2A3040]">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-[#FF4757] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#F1F2F6] mb-2">
              Firm Not Found
            </h2>
            <p className="text-[#8B92A8]">
              This prop firm does not exist in our database.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allowedRules = firm.rules?.filter((r) => r.category === "allowed") || [];
  const prohibitedRules = firm.rules?.filter((r) => r.category === "prohibited") || [];
  const payoutRules = firm.rules?.filter((r) => r.category === "payout_invalidation") || [];
  const restrictedCountries = firm.restrictions?.filter(
    (r) => r.status === "restricted"
  ) || [];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Header */}
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-bold text-2xl">
                  {firm.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F1F2F6]">
                    {firm.name}
                  </h1>
                  <p className="text-[#8B92A8] text-sm">{firm.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={firm.affiliateUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Account
                  </Button>
                </a>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#00D4AA]/10 text-[#00D4AA] border-0">
                <Star className="w-3 h-3 mr-1 fill-[#FFB800] text-[#FFB800]" />
                {firm.trustScore} Rating
              </Badge>
              <Badge className="bg-[#1A1F2E] text-[#8B92A8] border border-[#2A3040]">
                <Calendar className="w-3 h-3 mr-1" />
                {firm.payoutSchedule}
              </Badge>
              <Badge className="bg-[#1A1F2E] text-[#8B92A8] border border-[#2A3040]">
                <DollarSign className="w-3 h-3 mr-1" />
                {firm.profitSplit} Split
              </Badge>
              {firm.platforms?.map((p: string) => (
                <Badge
                  key={p}
                  variant="outline"
                  className="border-[#2A3040] text-[#8B92A8]"
                >
                  {p}
                </Badge>
              ))}
            </div>

            {/* Best For */}
            {firm.bestForTags && firm.bestForTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-[#8B92A8]">Best for:</span>
                {firm.bestForTags.map((tag: string) => (
                  <Badge
                    key={tag}
                    className="bg-[#0A0E1A] text-[#00D4AA] border border-[#00D4AA]/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-[#1A1F2E] border border-[#2A3040] w-full justify-start overflow-x-auto">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              Products & Pricing
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              Trading Rules
            </TabsTrigger>
            <TabsTrigger
              value="requirements"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              Requirements
            </TabsTrigger>
            <TabsTrigger
              value="countries"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              Countries
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-4">
              {firm.products?.map((product) => (
                <Card
                  key={product.id}
                  className={`bg-[#1A1F2E] border transition-colors ${
                    selectedProductId === product.id
                      ? "border-[#00D4AA]"
                      : "border-[#2A3040] hover:border-[#3A4050]"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#F1F2F6]">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[#8B92A8]">
                          <span>
                            Account:{" "}
                            <span className="text-[#F1F2F6]">
                              ${product.accountSize?.toLocaleString()}
                            </span>
                          </span>
                          <span>
                            Price:{" "}
                            <span className="text-[#00D4AA] font-semibold">
                              ${product.price}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedProductId(
                              selectedProductId === product.id
                                ? null
                                : product.id
                            )
                          }
                          className="border-[#00D4AA]/50 text-[#00D4AA] hover:bg-[#00D4AA]/10"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {selectedProductId === product.id
                            ? "Hide ROI"
                            : "Calculate ROI"}
                        </Button>
                        <a
                          href={firm.affiliateUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A]"
                          >
                            Buy
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
                      {[
                        { label: "Profit Target", value: `${product.profitTarget}%` },
                        { label: "Daily DD", value: `${product.dailyDrawdown}%` },
                        { label: "Max DD", value: `${product.maxDrawdown}%` },
                        { label: "Min Days", value: product.minimumDays || "None" },
                        { label: "Reset Fee", value: `$${product.resetFee}` },
                        { label: "Activation", value: `$${product.activationFee}` },
                        { label: "Monthly", value: `$${product.monthlyFee}` },
                        { label: "Phase 2", value: product.phase2Required ? "Yes" : "No" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-[#0A0E1A] rounded-lg p-2.5 text-center"
                        >
                          <div className="text-[10px] text-[#8B92A8]">
                            {stat.label}
                          </div>
                          <div className="text-xs font-semibold text-[#F1F2F6] mt-0.5">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {product.consistencyRule && (
                      <div className="flex items-start gap-2 text-sm text-[#8B92A8] bg-[#0A0E1A] rounded-lg p-3">
                        <Info className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                        {product.consistencyRule}
                      </div>
                    )}

                    {/* ROI Calculator */}
                    {selectedProductId === product.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-4 pt-4 border-t border-[#2A3040]"
                      >
                        <ROICalculator productId={product.id} />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Allowed */}
              <Card className="bg-[#1A1F2E] border-[#2A3040]">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-[#00D4AA] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    What You CAN Do
                  </h3>
                  <div className="space-y-3">
                    {allowedRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-start gap-3 p-3 bg-[#0A0E1A] rounded-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#F1F2F6]">{rule.rule}</div>
                          {rule.detail && (
                            <div className="text-xs text-[#8B92A8] mt-1">
                              {rule.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {allowedRules.length === 0 && (
                      <p className="text-sm text-[#8B92A8]">
                        No specific allowed rules documented.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prohibited */}
              <Card className="bg-[#1A1F2E] border-[#2A3040]">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-[#FF4757] mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    What You CANNOT Do
                  </h3>
                  <div className="space-y-3">
                    {prohibitedRules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          rule.severity === "critical"
                            ? "bg-[#FF4757]/10 border border-[#FF4757]/20"
                            : "bg-[#0A0E1A]"
                        }`}
                      >
                        <XCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            rule.severity === "critical"
                              ? "text-[#FF4757]"
                              : "text-[#FFB800]"
                          }`}
                        />
                        <div>
                          <div className="text-sm text-[#F1F2F6]">{rule.rule}</div>
                          {rule.detail && (
                            <div className="text-xs text-[#8B92A8] mt-1">
                              {rule.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {prohibitedRules.length === 0 && (
                      <p className="text-sm text-[#8B92A8]">
                        No specific prohibited rules documented.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payout Invalidation Rules */}
            {payoutRules.length > 0 && (
              <Card className="bg-[#1A1F2E] border-[#FFB800]/30">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-[#FFB800] mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Payout Invalidation Rules
                  </h3>
                  <p className="text-sm text-[#8B92A8] mb-4">
                    Breaking these rules will result in your payout being denied
                    or your account being terminated.
                  </p>
                  <div className="space-y-3">
                    {payoutRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-start gap-3 p-3 bg-[#FFB800]/5 border border-[#FFB800]/20 rounded-lg"
                      >
                        <AlertTriangle className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#F1F2F6]">{rule.rule}</div>
                          {rule.detail && (
                            <div className="text-xs text-[#8B92A8] mt-1">
                              {rule.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements">
            <Card className="bg-[#1A1F2E] border-[#2A3040]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#F1F2F6] mb-6">
                  From Purchase to Payout
                </h3>
                <div className="space-y-0">
                  {[
                    {
                      step: 1,
                      title: "Purchase Evaluation Account",
                      desc: "Select your account size and pay the evaluation fee. You'll receive credentials for the trading platform.",
                    },
                    {
                      step: 2,
                      title: "Complete Evaluation Phase",
                      desc: `Reach the profit target (${firm.products?.[0]?.profitTarget}%) while following all trading rules and drawdown limits.`,
                    },
                    {
                      step: 3,
                      title: "Pass and Get Funded",
                      desc: "Complete KYC verification and sign the trader agreement. Your live funded account will be activated.",
                    },
                    {
                      step: 4,
                      title: "Trade Live Account",
                      desc: "Follow live account rules (which may differ from evaluation rules). Continue trading profitably.",
                    },
                    {
                      step: 5,
                      title: "Request Payout",
                      desc: `Submit a payout request according to the ${firm.payoutSchedule} schedule. Meet minimum payout thresholds and consistency requirements.`,
                    },
                  ].map((item, i) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] text-sm font-bold">
                          {item.step}
                        </div>
                        {i < 4 && (
                          <div className="w-0.5 h-full bg-[#2A3040] my-1" />
                        )}
                      </div>
                      <div className="pb-8">
                        <h4 className="font-semibold text-[#F1F2F6] mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[#8B92A8]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countries Tab */}
          <TabsContent value="countries">
            <Card className="bg-[#1A1F2E] border-[#2A3040]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#F1F2F6] mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00D4AA]" />
                  Restricted Countries
                </h3>
                <p className="text-sm text-[#8B92A8] mb-6">
                  {firm.name} does not accept traders from the following
                  countries. All other countries are generally accepted.
                </p>
                {restrictedCountries.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {restrictedCountries.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 p-3 bg-[#0A0E1A] border border-[#FF4757]/20 rounded-lg"
                      >
                        <XCircle className="w-4 h-4 text-[#FF4757] shrink-0" />
                        <div>
                          <div className="text-sm text-[#F1F2F6]">
                            {r.countryName}
                          </div>
                          {r.notes && (
                            <div className="text-xs text-[#8B92A8]">{r.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
                    <span className="text-sm text-[#F1F2F6]">
                      No country restrictions documented for {firm.name}.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
