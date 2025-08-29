// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  const navItems = ['Home', 'Expenses', 'Trips', 'Approvals', 'Settings', 'Support'];

  return (
    <div className="w-64 bg-[#0D1117] text-slate-300 flex flex-col p-4 border-r border-slate-800">
      <div className="flex items-center mb-10">
        <img src="https://placehold.co/48x48/334155/E2E8F0?text=JC" alt="User Avatar" className="w-12 h-12 rounded-full mr-4" />
        <span className="font-semibold text-lg text-white">Janice Chandler</span>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item, index) => (
            <li key={item}>
              <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${index === 0 ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}>
                <span>{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="font-bold text-xl text-white">EXPENSIO</div>
    </div>
  );
};

export default Sidebar;
