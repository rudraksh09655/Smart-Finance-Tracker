// src/components/MonthlyReport.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyReport = ({ transactions }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
    }
  };

  const spendingTrendData = {
    labels: ['PO', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
    datasets: [{
      label: 'Spending',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(74, 222, 128, 0.5)',
      borderColor: 'rgba(74, 222, 128, 1)',
      borderWidth: 1,
    }],
  };

  const dayToDayData = {
    labels: ['Accommodation', 'Services', 'Food', 'Fuel'],
    datasets: [{
      label: 'Expenses',
      data: [80, 60, 90, 40],
      backgroundColor: 'rgba(132, 116, 226, 0.5)',
      borderColor: 'rgba(132, 116, 226, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-[#0D1117] p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">Monthly Report</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ height: '250px' }}>
        <div>
          <h4 className="text-sm text-slate-400 mb-2">Team Spending Trend</h4>
          <Bar options={chartOptions} data={spendingTrendData} />
        </div>
        <div>
          <h4 className="text-sm text-slate-400 mb-2">Day-to-Day Expenses</h4>
          <Bar options={chartOptions} data={dayToDayData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;