import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Globe,
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function CountryChecker() {
  const [countryCode, setCountryCode] = useState("");
  const [searched, setSearched] = useState(false);

  const { data, isLoading } = trpc.country.check.useQuery(
    { countryCode: countryCode.toUpperCase() },
    { enabled: searched && countryCode.length === 2 }
  );

  const handleSearch = () => {
    if (countryCode.length === 2) {
      setSearched(true);
    }
  };

  const commonCountries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "BR", name: "Brazil" },
    { code: "IN", name: "India" },
    { code: "NG", name: "Nigeria" },
    { code: "ZA", name: "South Africa" },
    { code: "JP", name: "Japan" },
    { code: "SG", name: "Singapore" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-[#F1F2F6] mb-2">
              Country Eligibility Checker
            </h1>
            <p className="text-[#8B92A8]">
              Find which prop firms accept traders from your country
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B92A8]" />
              <Input
                placeholder="Enter 2-letter country code (e.g. US, GB, CA)"
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value.toUpperCase().slice(0, 2));
                  setSearched(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={2}
                className="pl-10 bg-[#1A1F2E] border-[#2A3040] text-[#F1F2F6] placeholder:text-[#8B92A8] uppercase"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={countryCode.length !== 2}
              className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              Check
            </Button>
          </div>

          {/* Quick select */}
          <div className="mt-4">
            <p className="text-xs text-[#8B92A8] mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {commonCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountryCode(c.code);
                    setSearched(true);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    countryCode === c.code
                      ? "bg-[#00D4AA] text-[#0A0E1A]"
                      : "bg-[#0A0E1A] text-[#8B92A8] hover:text-[#F1F2F6] border border-[#2A3040]"
                  }`}
                >
                  {c.code} — {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="text-center text-[#8B92A8]">Checking eligibility...</div>
        )}

        {data && searched && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Summary */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <Card className="bg-[#00D4AA]/5 border-[#00D4AA]/20">
                <CardContent className="p-5 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#00D4AA] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {data.accepting.length}
                  </div>
                  <div className="text-sm text-[#8B92A8]">Firms Accepting</div>
                </CardContent>
              </Card>
              <Card className="bg-[#FF4757]/5 border-[#FF4757]/20">
                <CardContent className="p-5 text-center">
                  <XCircle className="w-8 h-8 text-[#FF4757] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#FF4757]">
                    {data.restricted.length}
                  </div>
                  <div className="text-sm text-[#8B92A8]">Firms Restricted</div>
                </CardContent>
              </Card>
            </div>

            {/* Accepting Firms */}
            {data.accepting.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#F1F2F6] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
                  Firms That Accept {data.countryCode} Traders
                  {data.accepting.some((f) => f.status === "restricted_live_only") && (
                    <span className="text-xs text-[#FFB800] font-normal">
                      (Some with live restrictions)
                    </span>
                  )}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.accepting.map((firm) => (
                    <Card
                      key={firm.id}
                      className={`border ${
                        firm.status === "restricted_live_only"
                          ? "bg-[#FFB800]/5 border-[#FFB800]/30"
                          : "bg-[#1A1F2E] border-[#2A3040]"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-bold text-xs">
                            {firm.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#F1F2F6] text-sm">
                              {firm.name}
                            </h3>
                            {firm.status === "restricted_live_only" && (
                              <span className="text-xs text-[#FFB800]">
                                Eval only — Live restricted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {firm.platforms?.slice(0, 3).map((p: string) => (
                            <Badge
                              key={p}
                              variant="outline"
                              className="text-[10px] border-[#2A3040] text-[#8B92A8]"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                        {firm.sampleProduct && (
                          <div className="text-xs text-[#8B92A8]">
                            From ${firm.sampleProduct.price} /{" "}
                            {firm.sampleProduct.accountSize
                              ? `$${(firm.sampleProduct.accountSize / 1000).toFixed(0)}K`
                              : "N/A"}
                          </div>
                        )}
                        <Link
                          to={`/compare/${firm.slug}`}
                          className="flex items-center text-xs text-[#00D4AA] mt-2 hover:underline"
                        >
                          View Profile <ChevronRight className="w-3 h-3" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Restricted Firms */}
            {data.restricted.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#F1F2F6] mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-[#FF4757]" />
                  Restricted Firms
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
                  {data.restricted.map((firm) => (
                    <Card
                      key={firm.id}
                      className="bg-[#1A1F2E] border-[#FF4757]/20"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-[#FF4757]/10 flex items-center justify-center text-[#FF4757] font-bold text-xs">
                            {firm.name.slice(0, 2).toUpperCase()}
                          </div>
                          <h3 className="font-semibold text-[#F1F2F6] text-sm">
                            {firm.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#FF4757]/80">
                          {firm.restrictionReason}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!searched && (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-[#2A3040] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#F1F2F6] mb-2">
              Enter Your Country Code
            </h3>
            <p className="text-sm text-[#8B92A8] max-w-md mx-auto">
              Use the search above or select a country to see which prop firms
              accept traders from your location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
