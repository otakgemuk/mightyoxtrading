import React, { useState } from 'react';

const PricingComparison = () => {
  // Pricing data from your database
  const pricingData = [
    {
      firm: 'Tradeify',
      accountType: 'Growth',
      evalCost: '$59',
      fundedSetupFee: 'Free',
      afterDiscount: '—',
      total: '$59',
      maxFunded: 1,
      ddType: 'EOD',
      target: '$1,500',
      maxDD: '$1,000',
      minDays: 1,
      consistencyEval: '—',
      consistencyFunded: '35%',
    },
    {
      firm: 'Lucid Trading',
      accountType: 'LucidFlex',
      evalCost: '$60',
      fundedSetupFee: 'Free',
      afterDiscount: '—',
      total: '$60',
      maxFunded: 1,
      ddType: 'EOD',
      target: '$1,250',
      maxDD: '$1,000',
      minDays: 2,
      consistencyEval: '—',
      consistencyFunded: '—',
    },
    {
      firm: 'Tradeify',
      accountType: 'Select',
      evalCost: '$65',
      fundedSetupFee: 'Free',
      afterDiscount: '—',
      total: '$65',
      maxFunded: 1,
      ddType: 'EOD',
      target: '$1,500',
      maxDD: '$1,000',
      minDays: 3,
      consistencyEval: '40%',
      consistencyFunded: '—',
    },
    // Add more rows as needed
  ];

  const [sortConfig, setSortConfig] = useState({ key: 'evalCost', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedData = [...pricingData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 to-slate-900 p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-8">Prop Firms Pricing Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900">
              <th
                className="px-4 py-3 text-left font-semibold text-slate-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('firm')}
              >
                FIRM
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">ACCOUNT TYPE</th>
              <th
                className="px-4 py-3 text-left font-semibold text-slate-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('evalCost')}
              >
                EVAL COST
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">FUNDED SETUP FEE</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">AFTER DISCOUNT</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">TOTAL</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">MAX # FUNDED</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">DD TYPE</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">TARGET</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">MAX DD</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">MIN DAYS</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">CONSISTENCY EVAL</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">CONSISTENCY FUNDED</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-white">{row.firm}</td>
                <td className="px-4 py-3 text-slate-300">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium">
                    {row.accountType}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-amber-400">{row.evalCost}</td>
                <td className="px-4 py-3 text-slate-300">{row.fundedSetupFee}</td>
                <td className="px-4 py-3 text-slate-400">{row.afterDiscount}</td>
                <td className="px-4 py-3 font-semibold text-amber-400">{row.total}</td>
                <td className="px-4 py-3 text-slate-300">{row.maxFunded}</td>
                <td className="px-4 py-3 text-blue-400 font-medium">{row.ddType}</td>
                <td className="px-4 py-3 text-slate-300">{row.target}</td>
                <td className="px-4 py-3 text-slate-300">{row.maxDD}</td>
                <td className="px-4 py-3 text-slate-300">{row.minDays}</td>
                <td className="px-4 py-3 text-slate-300">{row.consistencyEval}</td>
                <td className="px-4 py-3 text-slate-300">{row.consistencyFunded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-slate-400">
        <p>💡 Tip: Click column headers to sort. Compare pricing, terms, and consistency requirements.</p>
      </div>
    </div>
  );
};

export default PricingComparison;
