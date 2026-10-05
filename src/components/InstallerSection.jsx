import React, { useState } from 'react';
import { Download, ShieldCheck, Check, Copy, ExternalLink, Terminal, CheckCircle2 } from 'lucide-react';
import { INSTALLER_SPECS } from '../data/docsData';

export default function InstallerSection() {
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const copySha = () => {
    navigator.clipboard.writeText(INSTALLER_SPECS.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 1500);
  };

  const copyCmd = () => {
    navigator.clipboard.writeText('lyra --version');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1500);
  };

  return (
    <section id="installer" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Native Windows Installer
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            A self-contained executable installer. No Git, CMake, or Visual Studio C++ compilers required on the host system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Download card */}
          <div className="lg:col-span-6 rounded-xl border border-white/[0.1] bg-[#0c0c0c] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div>
                  <div className="text-base font-semibold text-white tracking-tight">
                    lyra-1.0.0.exe
                  </div>
                  <div className="text-xs font-mono text-neutral-500 mt-0.5">
                    Official Windows Installer · {INSTALLER_SPECS.fileSize}
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/[0.1] bg-white/[0.02] text-neutral-300">
                  Release v{INSTALLER_SPECS.version}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500 text-[10px] uppercase">Lyra Engine</div>
                  <div className="text-neutral-200 font-medium mt-0.5">{INSTALLER_SPECS.lyraVersion}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500 text-[10px] uppercase">Platform</div>
                  <div className="text-neutral-200 font-medium mt-0.5">Windows 10 / 11 (x64)</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500 text-[10px] uppercase">Privileges</div>
                  <div className="text-neutral-200 font-medium mt-0.5">No Admin / UAC Required</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-neutral-500 text-[10px] uppercase">License</div>
                  <div className="text-neutral-200 font-medium mt-0.5">SLA v1.0 (tomokuroki)</div>
                </div>
              </div>

              {/* Action */}
              <a
                href={INSTALLER_SPECS.downloadUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold tracking-tight transition-all active:scale-[0.99] shadow-sm mb-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download lyra-1.0.0.exe</span>
              </a>

              <a
                href={`${INSTALLER_SPECS.githubInstallerRepo}/releases/tag/${INSTALLER_SPECS.releaseTag}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors py-1"
              >
                <span>View Release on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* SHA-256 Checksum block */}
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SHA-256 Checksum</span>
                </span>
                <button
                  onClick={copySha}
                  className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 hover:text-white transition-colors"
                >
                  {copiedSha ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSha ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] font-mono text-neutral-600 bg-black/60 p-2.5 rounded border border-white/[0.04] break-all select-all leading-relaxed">
                {INSTALLER_SPECS.sha256}
              </p>
            </div>
          </div>

          {/* Right: Installation details & verification */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Features included */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-6">
              <h3 className="text-sm font-semibold text-white tracking-tight mb-4">
                What the installer configures
              </h3>
              <ul className="space-y-3">
                {INSTALLER_SPECS.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-neutral-200">{h.title}: </span>
                      <span className="text-xs text-neutral-400">{h.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal verification card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-5 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-500 mb-3 text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span>Verify in PowerShell or Command Prompt</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-black border border-white/[0.06] text-neutral-300">
                <span>lyra --version</span>
                <button
                  onClick={copyCmd}
                  className="text-neutral-500 hover:text-white transition-colors p-1"
                  title="Copy verification command"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="mt-2 text-neutral-600 text-[11px] pl-1">
                ↳ Outputs: <span className="text-neutral-400">Lyra Music Programming Language v3.0.0 (x64-windows)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
