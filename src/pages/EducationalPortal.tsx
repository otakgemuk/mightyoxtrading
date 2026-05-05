import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Layers,
  BarChart3,
  ShieldCheck,
  ArrowLeft,
  Calculator,
} from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons: Record<string, typeof BookOpen> = {
  basics: Layers,
  prop_firms: BarChart3,
  trading: ShieldCheck,
};

const categoryLabels: Record<string, string> = {
  basics: "Trading Basics",
  prop_firms: "Prop Firm Guide",
  trading: "Risk & Strategy",
};

export default function EducationalPortal() {
  const { data: topics } = trpc.education.list.useQuery();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const { data: activeTopic } = trpc.education.getBySlug.useQuery(
    { slug: selectedSlug! },
    { enabled: !!selectedSlug }
  );

  const grouped = topics?.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, typeof topics>);

  if (selectedSlug && activeTopic) {
    return (
      <div className="min-h-screen bg-[#0A0E1A]">
        <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedSlug(null)}
              className="text-[#8B92A8] hover:text-[#F1F2F6] mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-[#F1F2F6]"
            >
              {activeTopic.title}
            </motion.h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose-dark space-y-8"
          >
            {/* Content Sections */}
            {activeTopic.content?.sections?.map(
              (section: { heading: string; body: string }, i: number) => (
                <Card key={i} className="bg-[#1A1F2E] border-[#2A3040]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-[#00D4AA] mb-3">
                      {section.heading}
                    </h3>
                    <p className="text-[#8B92A8] leading-relaxed">{section.body}</p>
                  </CardContent>
                </Card>
              )
            )}

            {/* Table if present */}
            {activeTopic.content?.table && (
              <Card className="bg-[#1A1F2E] border-[#2A3040] overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0A0E1A] border-b border-[#2A3040]">
                          {Object.keys(activeTopic.content.table[0]).map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-[#00D4AA] font-semibold capitalize"
                            >
                              {h.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTopic.content.table.map(
                          (row: Record<string, string>, i: number) => (
                            <tr
                              key={i}
                              className="border-b border-[#2A3040] last:border-0"
                            >
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="px-4 py-3 text-[#F1F2F6]">
                                  {v}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Steps if present */}
            {activeTopic.content?.steps && (
              <Card className="bg-[#1A1F2E] border-[#2A3040]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#00D4AA] mb-4">
                    Step-by-Step Process
                  </h3>
                  <div className="space-y-0">
                    {activeTopic.content.steps.map(
                      (step: string, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] text-sm font-bold">
                              {i + 1}
                            </div>
                            {i < activeTopic.content.steps.length - 1 && (
                              <div className="w-0.5 h-full bg-[#2A3040] my-1" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="text-[#F1F2F6]">{step}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calculator if present */}
            {activeTopic.content?.calculator && (
              <DailyLossLimitCalculator />
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={() => {
                  setCompleted((prev) => {
                    const next = new Set(prev);
                    next.add(selectedSlug);
                    return next;
                  });
                  setSelectedSlug(null);
                }}
                className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-[#F1F2F6] mb-2">
              Educational Portal
            </h1>
            <p className="text-[#8B92A8]">
              Learn futures trading and prop firm fundamentals from the ground up
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {grouped &&
          Object.entries(grouped).map(([category, items]) => {
            const Icon = categoryIcons[category] || BookOpen;
            return (
              <div key={category} className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-[#00D4AA]" />
                  <h2 className="text-lg font-semibold text-[#F1F2F6]">
                    {categoryLabels[category] || category}
                  </h2>
                  <span className="text-xs text-[#8B92A8]">
                    {items.length} topics
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((topic, i) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        className="bg-[#1A1F2E] border-[#2A3040] hover:border-[#00D4AA]/40 transition-all cursor-pointer hover:-translate-y-1 group"
                        onClick={() => setSelectedSlug(topic.slug)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-[#F1F2F6] group-hover:text-[#00D4AA] transition-colors">
                              {topic.title}
                            </h3>
                            {completed.has(topic.slug) && (
                              <CheckCircle2 className="w-5 h-5 text-[#00D4AA] shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <Badge
                              variant="outline"
                              className="text-xs border-[#2A3040] text-[#8B92A8]"
                            >
                              {categoryLabels[topic.category] || topic.category}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-[#8B92A8] group-hover:text-[#00D4AA] transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

        {/* Progress */}
        {topics && (
          <Card className="bg-[#1A1F2E] border-[#2A3040] mt-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#F1F2F6]">
                    Your Progress
                  </h3>
                  <p className="text-sm text-[#8B92A8]">
                    {completed.size} of {topics.length} topics completed
                  </p>
                </div>
                <div className="text-2xl font-bold text-[#00D4AA]">
                  {topics.length > 0
                    ? Math.round((completed.size / topics.length) * 100)
                    : 0}
                  %
                </div>
              </div>
              <div className="mt-3 h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00D4AA] rounded-full transition-all duration-500"
                  style={{
                    width: `${topics.length > 0 ? (completed.size / topics.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";

function DailyLossLimitCalculator() {
  const [accountSize, setAccountSize] = useState(50000);
  const [drawdownPercent, setDrawdownPercent] = useState(5);
  const dailyLimit = accountSize * (drawdownPercent / 100);

  return (
    <Card className="bg-[#1A1F2E] border-[#2A3040]">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-[#00D4AA] mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Daily Loss Limit Calculator
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm text-[#8B92A8]">Account Size</label>
            <Input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value))}
              className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#8B92A8]">Daily Drawdown %</label>
            <Input
              type="number"
              value={drawdownPercent}
              onChange={(e) => setDrawdownPercent(Number(e.target.value))}
              className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6]"
            />
          </div>
        </div>
        <div className="bg-[#0A0E1A] rounded-xl p-4 text-center">
          <div className="text-sm text-[#8B92A8]">Your Daily Loss Limit</div>
          <div className="text-3xl font-bold text-[#FF4757]">
            ${dailyLimit.toLocaleString()}
          </div>
          <div className="text-xs text-[#8B92A8] mt-1">
            Stop trading when you reach this limit
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
