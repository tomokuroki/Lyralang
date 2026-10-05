import React, { useState, useRef, useEffect } from 'react';
import { Download, ExternalLink, Menu, X, ChevronDown, Terminal, Cpu, BookOpen, Music, Play, Layers, Disc3 } from 'lucide-react';
import { INSTALLER_SPECS } from '../data/docsData';

const NAV_GROUPS = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '#overview', desc: 'The declarative music programming language', icon: Music },
      { label: 'Showcase', href: '#showcase', desc: 'Listen to tracks composed purely in Lyra', icon: Disc3 },
      { label: 'Web Studio', scroll: 'playground', desc: 'Interactive browser-based DSP synthesizer', icon: Play },
      { label: 'Sound Modes', href: '#sound-modes', desc: 'From 4-bit vintage chips to 32-bit modern float', icon: Layers },
      { label: 'Architecture', href: '#architecture', desc: 'Lexer, Parser, Audio Engine & Export', icon: Cpu },
    ]
  },
  {
    label: 'Download',
    items: [
      { label: 'Windows Installer (v1.0.0)', scroll: 'installer', desc: 'Native executable, zero admin rights, automatic PATH', icon: Download },
      { label: 'Language Repository', href: INSTALLER_SPECS.githubLyraRepo, ext: true, desc: 'Open-source core on GitHub', icon: ExternalLink },
      { label: 'Installer Repository', href: INSTALLER_SPECS.githubInstallerRepo, ext: true, desc: 'Installer scripts & packaging pipeline', icon: ExternalLink },
    ]
  },
  {
    label: 'Docs',
    items: [
      { label: 'Language Reference', onClick: 'docs', desc: 'Commands, syntax rules, waveforms & timing', icon: BookOpen },
      { label: 'LANGUAGE.md', href: 'https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE.md', ext: true, desc: 'Official documentation on GitHub', icon: ExternalLink },
      { label: 'Russian Guide (LANGUAGE_3_RU)', href: 'https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE_3_RU.md', ext: true, desc: 'Полное руководство по Lyra 3 на русском', icon: ExternalLink },
    ]
  }
];

export default function Navbar({ onOpenDocs, onScrollToPlayground, onScrollToInstaller }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = (label) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleNav = (target) => {
    setActiveMenu(null);
    setMobileOpen(false);
    if (target === 'docs') onOpenDocs();
    else if (target === 'playground') onScrollToPlayground();
    else if (target === 'installer') onScrollToInstaller();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/75 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-8">
          <a href="#overview" className="flex items-center gap-2.5 group">
            <img src="/logo-mark.svg" alt="Lyra Logo" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-sm tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              Lyra
            </span>
          </a>

          {/* Desktop Nav with Cursor-style hover dropdowns */}
          <nav className="hidden md:flex items-center gap-1" onMouseLeave={handleMouseLeave}>
            {NAV_GROUPS.map((group) => {
              const isOpen = activeMenu === group.label;
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.label)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      isOpen ? 'text-white bg-white/[0.06]' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180 text-white' : 'text-neutral-500'}`} />
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div 
                      className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onMouseEnter={() => handleMouseEnter(group.label)}
                    >
                      <div className="w-80 rounded-xl bg-[#0c0c0c] border border-white/[0.1] shadow-2xl p-1.5 backdrop-blur-xl">
                        {group.items.map((item) => {
                          const Icon = item.icon || Terminal;
                          if (item.ext) {
                            return (
                              <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveMenu(null)}
                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group"
                              >
                                <div className="p-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-neutral-400 group-hover:text-white group-hover:border-white/[0.15] shrink-0 mt-0.5">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-200 group-hover:text-white">
                                    <span>{item.label}</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                                  </div>
                                  <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                                    {item.desc}
                                  </div>
                                </div>
                              </a>
                            );
                          }

                          if (item.href) {
                            return (
                              <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setActiveMenu(null)}
                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group"
                              >
                                <div className="p-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-neutral-400 group-hover:text-white group-hover:border-white/[0.15] shrink-0 mt-0.5">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-neutral-200 group-hover:text-white">
                                    {item.label}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                                    {item.desc}
                                  </div>
                                </div>
                              </a>
                            );
                          }

                          return (
                            <button
                              key={item.label}
                              onClick={() => handleNav(item.onClick || item.scroll)}
                              className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group"
                            >
                              <div className="p-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-neutral-400 group-hover:text-white group-hover:border-white/[0.15] shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-neutral-200 group-hover:text-white">
                                  {item.label}
                                </div>
                                <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={onOpenDocs}
              className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white rounded-md transition-colors"
            >
              Docs
            </button>
          </nav>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href={INSTALLER_SPECS.githubLyraRepo}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>

          <button
            onClick={onScrollToInstaller}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-neutral-200 text-black transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            className="md:hidden p-1.5 text-neutral-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0c0c] px-6 py-4 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                {group.label}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.ext) window.open(item.href, '_blank');
                    else if (item.href) window.location.href = item.href;
                    else handleNav(item.onClick || item.scroll);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left py-1.5 text-xs text-neutral-300 hover:text-white flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {item.ext && <ExternalLink className="w-3 h-3 text-neutral-600" />}
                </button>
              ))}
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={() => handleNav('installer')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-black text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Lyra Installer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
