import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RulesHub() {
  const { data: firms } = trpc.propFirm.list.useQuery({});
  const [selectedFirm, setSelectedFirm] = useState<number | null>(null);
  const [ruleFilter, setRuleFilter] = useState<string>("all");

  const { data: firmData } = trpc.propFirm.getById.useQuery(
    { id: selectedFirm! },
    { enabled: !!selectedFirm }
  );

  const selectedFirmSlug = firms?.find((f) => f.id === selectedFirm)?.slug;

  const allowedRules =
    firmData?.rules?.filter((r) => r.category === "allowed") || [];
  const prohibitedRules =
    firmData?.rules?.filter((r) => r.category === "prohibited") || [];
  const payoutRules =
    firmData?.rules?.filter(
      (r) => r.category === "payout_invalidation"
    ) || [];

  const filteredAllowed =
    ruleFilter === "all" || ruleFilter === "allowed" ? allowedRules : [];
  const filteredProhibited =
    ruleFilter === "all" || ruleFilter === "prohibited" ? prohibitedRules : [];
  const filteredPayout =
    ruleFilter === "all" || ruleFilter === "payout" ? payoutRules : [];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-[#F1F2F6] mb-2">
              Trading Rules Hub
            </h1>
            <p className="text-[#8B92A8]">
              Browse trading rules, restrictions, and payout invalidation rules for all prop firms
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Firm Selector */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[240px]">
            <Select
              onValueChange={(v) => setSelectedFirm(Number(v))}
            >
              <SelectTrigger className="bg-[#1A1F2E] border-[#2A3040] text-[#F1F2F6]">
                <SelectValue placeholder="Select a prop firm..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2E] border-[#2A3040]">
                {firms?.map((f) => (
                  <SelectItem
                    key={f.id}
                    value={String(f.id)}
                    className="text-[#F1F2F6]"
                  >
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select onValueChange={(v) => setRuleFilter(v)} value={ruleFilter}>
              <SelectTrigger className="bg-[#1A1F2E] border-[#2A3040] text-[#F1F2F6]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2E] border-[#2A3040]">
                <SelectItem value="all" className="text-[#F1F2F6]">
                  All Rules
                </SelectItem>
                <SelectItem value="allowed" className="text-[#F1F2F6]">
                  Allowed
                </SelectItem>
                <SelectItem value="prohibited" className="text-[#F1F2F6]">
                  Prohibited
                </SelectItem>
                <SelectItem value="payout" className="text-[#F1F2F6]">
                  Payout Rules
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedFirm && (
          <div className="text-center py-16">
            <ShieldCheck className="w-16 h-16 text-[#2A3040] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#F1F2F6] mb-2">
              Select a Prop Firm
            </h3>
            <p className="text-sm text-[#8B92A8]">
              Choose a firm above to see their complete trading rules and requirements
            </p>
          </div>
        )}

        {firmData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Firm Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-bold">
                {firmData.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F1F2F6]">
                  {firmData.name}
                </h2>
                {selectedFirmSlug && (
                  <Link
                    to={`/compare/${selectedFirmSlug}`}
                    className="text-sm text-[#00D4AA] hover:underline"
                  >
                    View Full Profile <ChevronRight className="w-3 h-3 inline" />
                  </Link>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Allowed */}
              {(ruleFilter === "all" || ruleFilter === "allowed") && (
                <Card className="bg-[#1A1F2E] border-[#2A3040]">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-[#00D4AA] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Allowed
                      <span className="text-xs text-[#8B92A8] font-normal">
                        ({allowedRules.length})
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {filteredAllowed.map((rule: typeof allowedRules[0]) => (
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
                      {filteredAllowed.length === 0 && (
                        <p className="text-sm text-[#8B92A8]">
                          No allowed rules documented
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prohibited */}
              {(ruleFilter === "all" || ruleFilter === "prohibited") && (
                <Card className="bg-[#1A1F2E] border-[#2A3040]">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-[#FF4757] mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Prohibited
                      <span className="text-xs text-[#8B92A8] font-normal">
                        ({prohibitedRules.length})
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {filteredProhibited.map((rule: typeof prohibitedRules[0]) => (
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
                            <div className="text-sm text-[#F1F2F6]">
                              {rule.rule}
                            </div>
                            {rule.detail && (
                              <div className="text-xs text-[#8B92A8] mt-1">
                                {rule.detail}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {filteredProhibited.length === 0 && (
                        <p className="text-sm text-[#8B92A8]">
                          No prohibited rules documented
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payout Invalidation */}
            {(ruleFilter === "all" || ruleFilter === "payout") &&
              filteredPayout.length > 0 && (
                <Card className="bg-[#1A1F2E] border-[#FFB800]/30">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-[#FFB800] mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Payout Invalidation Rules
                      <span className="text-xs text-[#8B92A8] font-normal">
                        ({payoutRules.length})
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {filteredPayout.map((rule: typeof payoutRules[0]) => (
                        <div
                          key={rule.id}
                          className="flex items-start gap-3 p-3 bg-[#FFB800]/5 border border-[#FFB800]/20 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-[#F1F2F6]">
                              {rule.rule}
                            </div>
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
