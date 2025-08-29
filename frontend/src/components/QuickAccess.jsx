// src/components/QuickAccess.jsx
import React from 'react';

const QuickAccess = () => {
  const buttons = ['+ New Expense', '+ Add Receipt', 'Create Report', 'Create Trip'];
  return (
    <div className="bg-[#0D1117] p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {buttons.map(text => (
          <button key={text} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-lg transition-colors">
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;