// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { sidebarConfig } from '../menuConfig';

export function Sidebar({ currentView, onNavigate }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCategoryClick = (category) => {
    // "Dashboard" no tiene sub-ítems funcionales todavía, así que su botón
    // navega directo al inicio en vez de solo expandir/contraer.
    if (category.key === 'dashboard') {
      onNavigate('dashboard');
      return;
    }
    toggleSection(category.key);
  };

  const handleItemClick = (item) => {
    if (item.view) {
      onNavigate(item.view);
    } else {
      alert(`${item.label}: módulo en desarrollo`);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-2 px-2 space-y-1 overflow-y-auto text-xs">
      {sidebarConfig.map((category) => {
        const isDashboard = category.key === 'dashboard';
        const isOpen = !isDashboard && !!openSections[category.key];
        return (
          <div key={category.key}>
            <button
              onClick={() => handleCategoryClick(category)}
              className="w-full flex items-center justify-between p-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center space-x-3">
                <span className="text-base">{category.icon}</span>
                <span>{category.label}</span>
              </span>
              {!isDashboard && (
                <span className="text-[10px] text-slate-400">{isOpen ? '▲' : '▼'}</span>
              )}
            </button>

            {isOpen && (
              <div className="pl-8 py-1 space-y-2 bg-slate-50 rounded-md my-1 border-l-2 border-blue-500 max-h-72 overflow-y-auto">
                {category.groups.map((group, gIndex) => (
                  <div key={group.title || gIndex}>
                    {group.title && (
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {group.title}
                      </div>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item, iIndex) => (
                        <button
                          key={`${gIndex}-${iIndex}`}
                          onClick={() => handleItemClick(item)}
                          className={`block w-full text-left py-1 font-medium transition-colors ${
                            item.view
                              ? currentView === item.view
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-blue-600'
                              : 'text-slate-400 italic cursor-default'
                          }`}
                        >
                          {item.label}
                          {!item.view ? ' (Próx.)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
