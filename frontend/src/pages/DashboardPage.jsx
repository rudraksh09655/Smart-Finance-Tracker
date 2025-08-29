// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Sidebar from '../components/Sidebar';
import RecentExpenses from '../components/RecentExpenses';
import QuickAccess from '../components/QuickAccess';
import MonthlyReport from '../components/MonthlyReport';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Could not fetch transactions', error);
      if (error.response?.status === 401) navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="flex h-screen bg-[#161B22] text-slate-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top-left panel can be added here */}
          <div className="bg-[#0D1117] p-6 rounded-xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
              {/* Placeholder content */}
          </div>
          <RecentExpenses transactions={transactions} />
        </div>
        <div className="mt-8">
          <QuickAccess />
        </div>
        <div className="mt-8">
          <MonthlyReport transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
