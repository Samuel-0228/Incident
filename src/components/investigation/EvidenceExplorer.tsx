import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EvidenceItem } from '../../types/investigation';
import { EvidenceViewerModal } from './EvidenceViewerModal';
import { FileSearch, Mail, Terminal, FileCode, Wifi, Key, Server, Eye, CheckCircle2 } from 'lucide-react';

export const EvidenceExplorer: React.FC = () => {
  const { evidenceItems, selectedEvidence, setSelectedEvidence, evidenceReviewedIds } = useInvestigation();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'EMAIL',
    'LOG',
    'FILE',
    'NETWORK CAPTURE',
    'CREDENTIAL EVENT',
    'ENDPOINT ARTIFACT'
  ];

  const filteredItems = evidenceItems.filter(
    (item) => activeCategory === 'ALL' || item.type === activeCategory
  );

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return Mail;
      case 'LOG':
        return Terminal;
      case 'FILE':
        return FileCode;
      case 'NETWORK CAPTURE':
        return Wifi;
      case 'CREDENTIAL EVENT':
        return Key;
      case 'ENDPOINT ARTIFACT':
        return Server;
      default:
        return FileSearch;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <FileSearch className="w-5 h-5 text-white inline" />
            <span>EVIDENCE MANAGEMENT & REPOSITORY</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Inspected artifacts, captured network streams, syslog dumps & email bodies
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1 bg-[#141414] p-1.5 rounded border border-[#242424] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-white text-black font-bold'
                  : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const Icon = getCategoryIcon(item.type);
          const isReviewed = evidenceReviewedIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedEvidence(item)}
              className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#3A3A3A] p-4 rounded transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-[#777777] group-hover:text-white" />
                    <span className="text-white font-bold text-xs">{item.id}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                      item.status === 'CONFIRMED MALICIOUS'
                        ? 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                        : item.status === 'SUSPICIOUS'
                        ? 'bg-[#1C150C] border-[#451A03] text-amber-400'
                        : 'bg-[#0D1626] border-[#1E3A8A] text-blue-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[#777777] text-[10px]">
                    TYPE: <span className="text-[#A0A0A0] font-semibold">{item.type}</span>
                  </div>
                  <div className="text-[#777777] text-[10px]">
                    SOURCE: <span className="text-[#A0A0A0] font-semibold truncate block">{item.source}</span>
                  </div>
                  {item.subject && (
                    <div className="text-white font-semibold text-xs truncate mt-1">
                      {item.subject}
                    </div>
                  )}
                  {item.attachment && (
                    <div className="text-amber-400 text-[11px] font-semibold">
                      ATTACHMENT: {item.attachment}
                    </div>
                  )}
                </div>

                <p className="text-[#777777] text-[11px] line-clamp-2 leading-relaxed">
                  {item.details || item.body || item.rawLog}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#242424] text-[10px]">
                <span className="text-[#777777]">{item.timestamp}</span>
                <div className="flex items-center space-x-2">
                  {isReviewed && (
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 inline" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                  <span className="text-white group-hover:underline flex items-center space-x-1">
                    <Eye className="w-3 h-3 inline" />
                    <span>INSPECT</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Viewer Modal */}
      <EvidenceViewerModal item={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
    </div>
  );
};
