import React, { useState } from 'react';
import { ExternalLink, ArrowUp, Download, ShieldCheck, X } from 'lucide-react';
import { INSTALLER_SPECS } from '../data/docsData';

const FULL_LICENSE_TEXT = `SOFTWARE LICENSE AGREEMENT
Version 1.0

1. This LICENSE AGREEMENT is between the copyright holder ("Author", tomokuroki and contributors), and the Individual or Organization ("Licensee") accessing and otherwise using this software ("the Software") in source or binary form and its associated documentation.

2. Subject to the terms and conditions of this License Agreement, the Author hereby grants Licensee a nonexclusive, royalty-free, world-wide license to reproduce, analyze, test, perform and/or display publicly, prepare derivative works, distribute, and otherwise use the Software alone or in any derivative version, provided, however, that this License Agreement and the copyright notice (i.e., "Copyright (c) 2026 tomokuroki and contributors") are retained in the Software alone or in any derivative version prepared by Licensee.

3. In the event Licensee prepares a derivative work that is based on or incorporates the Software or any part thereof, and wants to make the derivative work available to others as provided herein, then Licensee hereby agrees to include in any such work a brief summary of the changes made to the Software.

4. The Author is making the Software available to Licensee on an "AS IS" basis. THE AUTHOR MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED. BY WAY OF EXAMPLE, BUT NOT LIMITATION, THE AUTHOR MAKES NO AND DISCLAIMS ANY REPRESENTATION OR WARRANTY OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE WILL NOT INFRINGE ANY THIRD PARTY RIGHTS.

5. THE AUTHOR SHALL NOT BE LIABLE TO LICENSEE OR ANY OTHER USERS OF THE SOFTWARE FOR ANY INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES OR LOSS AS A RESULT OF MODIFYING, DISTRIBUTING, OR OTHERWISE USING THE SOFTWARE, OR ANY DERIVATIVE THEREOF, EVEN IF ADVISED OF THE POSSIBILITY THEREOF.

6. This License Agreement will automatically terminate upon a material breach of its terms and conditions.

7. Nothing in this License Agreement shall be deemed to create any relationship of agency, partnership, or joint venture between the Author and Licensee. This License Agreement does not grant permission to use the Author's trademarks or trade name in a trademark sense to endorse or promote products or services of Licensee, or any third party.

8. By copying, installing or otherwise using the Software, Licensee agrees to be bound by the terms and conditions of this License Agreement.`;

export default function Footer({ onOpenDocs, onScrollToInstaller }) {
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  return (
    <footer className="bg-black py-16 text-neutral-400">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/[0.08]">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo-mark.svg" alt="Lyra Logo" className="w-5 h-5 object-contain" />
              <span className="font-semibold text-white tracking-tight text-sm">
                Lyra
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              A minimalist, deterministic music programming language.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <button onClick={onScrollToInstaller} className="hover:text-white transition-colors">
                  Windows Installer
                </button>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              </li>
            </ul>
          </div>

          {/* Docs */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Documentation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenDocs} className="hover:text-white transition-colors">
                  Reference Manual
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>LANGUAGE.md</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE_3_RU.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Russian Guide</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tomokuroki/lyra/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Internals Spec</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* GitHub & Releases */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Source & Binaries
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href={INSTALLER_SPECS.downloadUrl}
                  className="text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3 text-neutral-400" />
                  <span>lyra-1.0.0.exe</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTALLER_SPECS.githubLyraRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>tomokuroki/lyra</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                </a>
              </li>
              <li>
                <a
                  href={INSTALLER_SPECS.githubInstallerRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>tomokuroki/Lyra-Installer</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-600" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600">
          <div>
            Copyright © 2026{' '}
            <a
              href="https://github.com/tomokuroki"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              tomokuroki and contributors
            </a>
            {' · '}
            <button
              onClick={() => setShowLicenseModal(true)}
              className="text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Software License Agreement v1.0
            </button>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Software License Agreement Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-white/[0.1] bg-[#0d0d0d] p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white font-mono">
                  Software License Agreement Version 1.0
                </span>
              </div>
              <button
                onClick={() => setShowLicenseModal(false)}
                className="p-1 rounded text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap select-all bg-black/50 p-4 rounded border border-white/[0.04]">
              {FULL_LICENSE_TEXT}
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
