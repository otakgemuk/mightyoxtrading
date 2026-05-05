import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ShoppingCart,
  Star,
  BarChart3,
  Grid3x3,
  Table as TableIcon,
} from "lucide-react";
import { motion } from "framer-motion";

// Account size options for filtering
const accountSizes = [25000, 50000, 100000, 150000, 200000, 300000];
const platforms = ["Rithmic", "Tradovate", "NinjaTrader", "TradingView", "DX Trade"];

export default function Compare() {
  const [search, setSearch] = useState("");
  const [priceMax, setPriceMax] = useState(500);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const { data: firms, isLoading } = trpc.propFirm.list.useQuery({
    search: search || undefined,
    priceMax,
    accountSize: selectedSize || undefined,
    platform: selectedPlatform || undefined,
    countryCode: countryCode || undefined,
  });

  const clearFilters = () => {
    setSearch("");
    setPriceMax(500);
    setSelectedSize(null);
    setSelectedPlatform(null);
    setCountryCode("");
  };

  const hasFilters = search || priceMax < 500 || selectedSize || selectedPlatform || countryCode;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Header */}
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-[#F1F2F6] mb-2">
              Compare Prop Firms
            </h1>
            <p className="text-[#8B92A8]">
              Side-by-side comparison of {firms?.length || 0} futures prop firms
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Advanced Filters Panel */}
        <div className="bg-[#1A1F2E] border border-[#2A3040] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#F1F2F6] mb-4">Filter Prop Firms</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-[#8B92A8] mb-2">Account Size</label>
              <div className="space-y-2">
                {['$25K', '$50K', '$100K', '$150K+'].map((size) => (
                  <label key={size} className="flex items-center text-sm cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#2A3040]" />
                    <span className="ml-2 text-[#F1F2F6]">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-[#8B92A8] mb-2">Account Type</label>
              <div className="space-y-2">
                {['Evaluation', 'Straight to Funded'].map((type) => (
                  <label key={type} className="flex items-center text-sm cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#2A3040]" />
                    <span className="ml-2 text-[#F1F2F6]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Drawdown Type */}
            <div>
              <label className="block text-sm font-medium text-[#8B92A8] mb-2">Drawdown Type</label>
              <div className="space-y-2">
                {['EOD', 'Intraday', 'Static'].map((type) => (
                  <label key={type} className="flex items-center text-sm cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#2A3040]" />
                    <span className="ml-2 text-[#F1F2F6]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-[#8B92A8] mb-2">Supported Platforms</label>
              <select className="w-full bg-[#0A0E1A] border border-[#2A3040] rounded px-3 py-2 text-[#F1F2F6] text-sm">
                <option>All Platforms</option>
                <option>Rithmic</option>
                <option>NinjaTrader</option>
                <option>TradingView</option>
                <option>Tradovate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B92A8]" />
            <Input
              placeholder="Search firms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#1A1F2E] border-[#2A3040] text-[#F1F2F6] placeholder:text-[#8B92A8]"
            />
          </div>
          <div className="w-40">
            <Input
              placeholder="Country (e.g. US)"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              className="bg-[#1A1F2E] border-[#2A3040] text-[#F1F2F6] placeholder:text-[#8B92A8]"
            />
          </div>
          <Button
            onClick={clearFilters}
            disabled={!hasFilters}
            variant="outline"
            className="border-[#2A3040] text-[#8B92A8] hover:bg-[#1A1F2E]"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Comparison Table */}
        {viewMode === "table" && (
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A3040] bg-[#1A1F2E]">
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">FIRM</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">DLL</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">MLL</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">PRICE</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">SIZE</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">ALL-IN</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">DISCOUNT</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">MIN DAYS</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">RESET $</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">MAX FUNDED</th>
                  <th className="px-4 py-3 text-left text-[#8B92A8] font-semibold">CODE</th>
                </tr>
              </thead>
              <tbody>
                {firms?.map((firm) => (
                  <tr key={firm.id} className="border-b border-[#2A3040] hover:bg-[#0A0E1A]/50">
                    <td className="px-4 py-3 text-sm font-semibold text-[#F1F2F6]">
                      {firm.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B92A8]">
                      {firm.products?.[0]?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#00D4AA]">
                      ${firm.minPrice}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B92A8]">
                      {firm.platforms?.[0] || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B92A8]">
                      {firm.profitSplit}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B92A8]">
                      {firm.products?.[0]?.profitTarget}%
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={firm.affiliateUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] text-xs"
                        >
                          Buy Now
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1F2E] border-[#2A3040]">
                <CardContent className="p-5 space-y-4">
                  <div className="h-10 bg-[#0A0E1A] rounded-lg animate-pulse" />
                  <div className="h-4 bg-[#0A0E1A] rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : firms && firms.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firms.map((firm) => (
              <Card key={firm.id} className="bg-[#1A1F2E] border-[#2A3040] hover:border-[#3A4050] transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#F1F2F6]">{firm.name}</h3>
                    <Badge className="bg-[#00D4AA]/20 text-[#00D4AA]">
                      ${firm.minPrice}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#8B92A8] mb-4">
                    {firm.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B92A8]">Platforms:</span>
                      <span className="text-[#F1F2F6]">{firm.platforms?.join(", ") || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B92A8]">Profit Split:</span>
                      <span className="text-[#F1F2F6]">{firm.profitSplit}</span>
                    </div>
                  </div>
                  <Link to={`/compare/${firm.slug}`}>
                    <Button className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A]">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#8B92A8]">No firms found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     