// src/components/TopMenuBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { topMenuConfig } from '../menuConfig';

export function TopMenuBar({ currentView, onNavigate }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoverNav, setHoverNav] = useState(false); // true tras un clic: permite cambiar de menú solo con hover
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);

  const openAt = (index) => {
    const btn = buttonRefs.current[index];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    // position: fixed evita que el overflow-x-auto del header recorte el submenú
    setPosition({ top: rect.bottom, left: rect.left });
    setOpenIndex(index);
  };

  const handleButtonClick = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
      setHoverNav(false);
    } else {
      openAt(index);
      setHoverNav(true);
    }
  };

  const handleMouseEnter = (index) => {
    if (hoverNav && openIndex !== null) openAt(index);
  };

  const handleItemClick = (item) => {
    setOpenIndex(null);
    setHoverNav(false);
    if (item.view) {
      onNavigate(item.view);
    } else {
      alert(`${item.label}: módulo en desarrollo`);
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenIndex(null);
        setHoverNav(false);
      }
    };
    const handleResize = () => setOpenIndex(null);

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeCategory = openIndex !== null ? topMenuConfig[openIndex] : null;

  return (
    <header
      ref={containerRef}
      className="relative bg-[#f0f0f0] text-slate-700 h-8 flex items-center px-2 text-xs select-none border-b border-[#cccccc] overflow-x-auto whitespace-nowrap z-30 shadow-sm"
    >
      <nav className="flex space-x-0.5 items-center">
        {topMenuConfig.map((category, index) => (
          <button
            key={category.key}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleButtonClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`px-2 py-1 rounded-none cursor-pointer font-normal border border-transparent hover:bg-[#e0e0e0] hover:border-[#adadad] active:bg-[#cccccc] ${
              openIndex === index ? 'bg-[#cccccc] border-[#adadad]' : ''
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>

      {activeCategory && (
        <div
          className="fixed w-72 bg-white text-slate-800 rounded-none shadow-md border border-[#cccccc] z-50 py-1 max-h-[70vh] overflow-y-auto"
          style={{ top: position.top, left: position.left }}
        >
          <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
            {activeCategory.label}
          </div>
          {activeCategory.groups.map((group, gIndex) => (
            <div key={group.title || gIndex} className={gIndex > 0 ? 'border-t border-[#e5e5e5] mt-1 pt-1' : ''}>
              {group.title && (
                <div className="px-3 py-1 font-bold text-slate-500 text-[11px] bg-slate-50 mt-1">
                  {group.title}
                </div>
              )}
              {group.items.map((item, iIndex) => (
                <button
                  key={`${gIndex}-${iIndex}`}
                  onClick={() => handleItemClick(item)}
                  disabled={!item.view}
                  className={`w-full text-left block px-4 py-1 ${
                    group.title ? 'pl-6' : ''
                  } ${
                    !item.view
                      ? 'text-slate-400 cursor-default'
                      : `hover:bg-[#3399ff] hover:text-white cursor-pointer ${
                          currentView === item.view ? 'text-blue-600 font-medium' : ''
                        }`
                  }`}
                >
                  {item.label}
                  {!item.view ? ' (Próx.)' : ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
