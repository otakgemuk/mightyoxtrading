import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PricingFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    sizes: [],
    accountTypes: [],
    drawdownTypes: [],
    platforms: 'All',
    firms: 'All',
    evalFeatures: 'All',
    fundedFeatures: 'All',
    topRanked: false,
    dailyPayout: false,
  });

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  const handleDropdownChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  const handleToggle = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: !prev[key] };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 to-slate-900 p-6 rounded-lg mb-8 border border-slate-800">
      {/* Top Row - Size, Account Type, Drawdown Type, Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Size */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Size</label>
          <div className="space-y-2">
            {['25k', '50k', '100k', '150k+'].map((size) => (
              <label key={size} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sizes.includes(size)}
                  onChange={() => handleCheckboxChange('sizes', size)}
                  className="w-4 h-4 rounded border-slate-600 text-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-slate-300">${size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Account Type</label>
          <div className="space-y-2">
            {['Straight to Funded', 'Evaluation'].map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.accountTypes.includes(type)}
                  onChange={() => handleCheckboxChange('accountTypes', type)}
                  className="w-4 h-4 rounded border-slate-600 text-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-slate-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Drawdown Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Drawdown Type</label>
          <div className="space-y-2">
            {['EOD', 'Intraday', 'Static'].map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.drawdownTypes.includes(type)}
                  onChange={() => handleCheckboxChange('drawdownTypes', type)}
                  className="w-4 h-4 rounded border-slate-600 text-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-slate-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Supported Platforms */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Supported Platforms</label>
          <div className="relative">
            <select
              value={filters.platforms}
              onChange={(e) => handleDropdownChange('platforms', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm cursor-pointer appearance-none pr-8"
            >
              <option>All</option>
              <option>Rithmic</option>
              <option>NinjaTrader</option>
              <option>TradingView</option>
              <option>Tradovate</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Row - Filters and Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter Prop Firms */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Filter Prop Firms</label>
          <div className="relative">
            <select
              value={filters.firms}
              onChange={(e) => handleDropdownChange('firms', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm cursor-pointer appearance-none pr-8"
            >
              <option>All</option>
              <option>Apex</option>
              <option>Topstep</option>
              <option>Tradeify</option>
              <option>Lucid Trading</option>
              <option>E8 Markets</option>
              <option>Earn2Trade</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Evaluation Features */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Evaluation Features</label>
          <div className="relative">
            <select
              value={filters.evalFeatures}
              onChange={(e) => handleDropdownChange('evalFeatures', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm cursor-pointer appearance-none pr-8"
            >
              <option>All</option>
              <option>No Consistency Rule</option>
              <option>Consistency Required</option>
              <option>Fast Track</option>
              <option>Two-Step</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Funded Features */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Funded Features</label>
          <div className="relative">
            <select
              value={filters.fundedFeatures}
              onChange={(e) => handleDropdownChange('fundedFeatures', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm cursor-pointer appearance-none pr-8"
            >
              <option>All</option>
              <option>Daily Payouts</option>
              <option>Weekly Payouts</option>
              <option>Monthly Payouts</option>
              <option>Profit Split 80/20</option>
              <option>Profit Split 90/10</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Special Features Row */}
      <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.topRanked}
            onChange={() => handleToggle('topRanked')}
            className="w-4 h-4 rounded border-slate-600 text-blue-500 cursor-pointer"
          />
          <span className="ml-2 text-sm font-medium text-slate-300">Top 5 Ranked Firms</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.dailyPayout}
            onChange={() => handleToggle('dailyPayout')}
            className="w-4 h-4 rounded border-slate-600 text-blue-500 cursor-pointer"
          />
          <span className="ml-2 text-sm font-medium text-slate-300">Daily Payout Club</span>
        </label>
      </div>

      {/* Active Filters Display */}
      {(filters.sizes.length > 0 ||
        filters.accountTypes.length > 0 ||
        filters.drawdownTypes.length > 0 ||
        filters.topRanked ||
        filters.dailyPayout) && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.sizes.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300"
              >
                Size: ${size}
              </span>
            ))}
            {filters.accountTypes.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300"
              >
                {type}
              </span>
            ))}
            {filters.drawdownTypes.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300"
              >
                {type}
              </span>
            ))}
            {filters.topRanked && (
              <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300">
                Top 5 Ranked
              </span>
            )}
            {filters.dailyPayout && (
              <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300">
                Daily Payout
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingFilters;
