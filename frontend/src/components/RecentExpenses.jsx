// src/components/RecentExpenses.jsx
import React from 'react';

const RecentExpenses = ({ transactions }) => {
  const getTeamColor = (team) => {
    switch (team) {
      case 'Marketing': return 'bg-purple-500';
      case 'Development': return 'bg-red-500';
      case 'Finance': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-[#0D1117] p-6 rounded-xl border border-slate-800 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800 text-sm text-slate-400">
            <th className="py-2">Subject</th>
            <th className="py-2">Employee</th>
            <th className="py-2">Team</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 5).map(t => (
            <tr key={t.id} className="border-b border-slate-800">
              <td className="py-3 font-medium text-slate-200">{t.category}</td>
              <td className="py-3 text-slate-300">John Smith</td>
              <td className="py-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getTeamColor('Marketing')}`}>
                  Marketing
                </span>
              </td>
              <td className="py-3 text-right font-semibold text-white">€{t.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentExpenses;