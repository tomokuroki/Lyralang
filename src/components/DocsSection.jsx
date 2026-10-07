import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ChevronRight, Terminal, BookOpen } from 'lucide-react';
import { DOCS_SECTIONS, INSTALLER_SPECS } from '../data/docsData';

// Parse inline text with bold (**text**), code (`text`), and nested (**`text`**)
function renderFormattedText(text) {
  if (!text) return null;

  // First replace nested bold code: **`code`** -> special token or handle cleanly
  // Tokenize by code blocks, bold blocks, plain text
  const tokens = [];
  let remaining = text;

  // Regex to match **`code`** or **bold** or `code`
  const regex = /(\*\*(?:`[^`]+`|[^*]+)\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        val: text.substring(lastIndex, match.index)
      });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const inner = matchedStr.slice(2, -2);
      if (inner.startsWith('`') && inner.endsWith('`')) {
        tokens.push({ type: 'bold_code', val: inner.slice(1, -1) });
      } else {
        tokens.push({ type: 'bold', val: inner });
      }
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      tokens.push({ type: 'code', val: matchedStr.slice(1, -1) });
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', val: text.substring(lastIndex) });
  }

  return tokens.map((tok, i) => {
    if (tok.type === 'bold_code') {
      return (
        <code key={i} className="font-mono text-xs text-amber-300 font-semibold bg-white/[0.06] border border-white/[0.08] px-1 py-0.5 rounded">
          {tok.val}
        </code>
      );
    }
    if (tok.type === 'bold') {
      return <strong key={i} className="text-white font-semibold">{tok.val}</strong>;
    }
    if (tok.type === 'code') {
      return (
        <code key={i} className="font-mono text-xs text-neutral-200 bg-white/[0.06] border border-white/[0.08] px-1 py-0.5 rounded">
          {tok.val}
        </code>
      );
    }
    return <span key={i}>{tok.val}</span>;
  });
}

function RenderDocBody({ rawText }) {
  if (!rawText) return null;

  const rawBlocks = rawText.trim().split(/\n\n+/);

  return (
    <div className="space-y-4 text-xs text-neutral-400 leading-relaxed font-normal">
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="text-sm font-semibold text-white mt-6 mb-2 tracking-tight">
              {trimmed.slice(4)}
            </h4>
          );
        }

        // Code block ```
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined);
          return (
            <div key={bIdx} className="rounded-lg bg-[#080808] border border-white/[0.08] overflow-hidden my-3">
              <div className="p-3.5 font-mono text-xs text-neutral-300 overflow-x-auto leading-5 whitespace-pre">
                {codeLines.join('\n')}
              </div>
            </div>
          );
        }

        // Bullet lists
        const lines = trimmed.split('\n');
        const isList = lines.some((l) => l.trim().startsWith('- '));
        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-2">
              {lines.map((line, lIdx) => {
                const itemTrimmed = line.trim();
                if (itemTrimmed.startsWith('- ')) {
                  const content = itemTrimmed.slice(2);
                  return (
                    <li key={lIdx} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-neutral-500 select-none mt-0.5">•</span>
                      <span className="flex-1">{renderFormattedText(content)}</span>
                    </li>
                  );
                }
                return (
                  <li key={lIdx} className="text-neutral-400 pl-4">
                    {renderFormattedText(itemTrimmed)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={bIdx} className="text-neutral-300">
            {renderFormattedText(trimmed.replace(/\n/g, ' '))}
          </p>
        );
      })}
    </div>
  );
}

export default function DocsSection() {
  const [selectedId, setSelectedId] = useState(DOCS_SECTIONS[0].id);
  const [copiedKey, setCopiedKey] = useState(null);

  const activeDoc = DOCS_SECTIONS.find((d) => d.id === selectedId) || DOCS_SECTIONS[0];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <section id="docs" className="py-24 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Documentation
            </h2>
            <p className="text-sm text-neutral-400">
              Grammar specification, command tables, waveform types, and CLI flags.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE.md"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <span>LANGUAGE.md</span>
              <ExternalLink className="w-3 h-3 text-neutral-600" />
            </a>
            <a
              href="https://github.com/tomokuroki/lyra/blob/main/docs/LANGUAGE_3_RU.md"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <span>Russian Guide</span>
              <ExternalLink className="w-3 h-3 text-neutral-600" />
            </a>
          </div>
        </div>

        {/* Documentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 rounded-xl border border-white/[0.08] bg-[#0c0c0c] p-2 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Topics
            </div>
            {DOCS_SECTIONS.map((sec) => {
              const active = sec.id === selectedId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedId(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between outline-none ${
                    active
                      ? 'bg-white/[0.08] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{sec.title}</span>
                  {active && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
              );
            })}
          </div>

          {/* Main Doc View */}
          <div className="lg:col-span-8 rounded-xl border border-white/[0.1] bg-[#0c0c0c] p-6 shadow-2xl min-h-[420px]">
            
            {/* Header info */}
            <div className="pb-5 border-b border-white/[0.06] mb-6">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                {activeDoc.category}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white mt-1 mb-1">
                {activeDoc.title}
              </h3>
              <p className="text-xs text-neutral-400">
                {activeDoc.description}
              </p>
            </div>

            {/* If doc has a table */}
            {activeDoc.table && (
              <div className="rounded-lg border border-white/[0.06] overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-[#080808]">
                      <th className="py-2.5 px-4 text-[11px] font-mono text-neutral-400 font-medium">Directive</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono text-neutral-400 font-medium">Description</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono text-neutral-400 font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                    {activeDoc.table.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 text-amber-300 font-semibold whitespace-nowrap">{row.cmd}</td>
                        <td className="py-2.5 px-4 text-neutral-300 font-sans">{row.desc}</td>
                        <td className="py-2.5 px-4 text-sky-400 whitespace-nowrap">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* If doc has CLI commands */}
            {activeDoc.commands && (
              <div className="space-y-2 mb-6">
                {activeDoc.commands.map((cmdItem, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#080808] border border-white/[0.06]"
                  >
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono text-white block mb-0.5">
                        {cmdItem.cmd}
                      </code>
                      <p className="text-[11px] text-neutral-500 font-sans">
                        {cmdItem.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(cmdItem.cmd, `cmd-${i}`)}
                      className="p-1.5 rounded text-neutral-500 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedKey === `cmd-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Markdown rendered body */}
            {activeDoc.content && <RenderDocBody rawText={activeDoc.content} />}

          </div>

        </div>

      </div>
    </section>
  );
}
