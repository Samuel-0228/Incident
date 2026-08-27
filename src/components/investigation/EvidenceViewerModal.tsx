import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EvidenceItem } from '../../types/investigation';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceViewerModal: React.FC<Props> = ({ item, onClose }) => {
  const { markEvidenceReviewed, evidenceReviewedIds } = useInvestigation();

  if (!item) return null;

  const isReviewed = evidenceReviewedIds.has(item.id);

  const handleConfirmReview = () => {
    markEvidenceReviewed(item.id);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none font-mono-tech">
      <div className="bg-[#101010] border border-[#242424] rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="bg-[#141414] border-b border-[#242424] px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-[#777777]" />
            <div>
              <span className="text-white font-bold text-xs uppercase font-sans">
                EVIDENCE ARTIFACT INSPECTOR: {item.id}
              </span>
              <span className="text-[#777777] text-[10px] ml-3 font-mono-tech">
                TYPE: {item.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#777777] hover:text-white transition-colors p-1 rounded hover:bg-[#242424]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141414] p-3 rounded border border-[#242424]">
            <div>
              <span className="text-[#777777] block text-[10px]">SOURCE</span>
              <span className="text-white font-semibold">{item.source}</span>
            </div>
            {item.recipient && (
              <div>
                <span className="text-[#777777] block text-[10px]">RECIPIENT</span>
                <span className="text-white font-semibold">{item.recipient}</span>
              </div>
            )}
            <div>
              <span className="text-[#777777] block text-[10px]">TIMESTAMP</span>
              <span className="text-white font-semibold">{item.timestamp}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">STATUS</span>
              <span
                className={`font-semibold ${
                  item.status === 'CONFIRMED MALICIOUS'
                    ? 'text-red-400'
                    : item.status === 'SUSPICIOUS'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {item.subject && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">SUBJECT</span>
              <div className="bg-[#141414] p-2.5 rounded border border-[#242424] text-white font-semibold">
                {item.subject}
              </div>
            </div>
          )}

          {item.attachment && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">ATTACHMENT ARTIFACT</span>
              <div className="bg-[#141414] p-2.5 rounded border border-[#242424] text-amber-400 font-semibold flex items-center justify-between">
                <span>FILE: {item.attachment}</span>
                <span className="text-[10px] bg-[#1E1E1E] text-[#A0A0A0] px-2 py-0.5 rounded border border-[#242424]">
                  MACRO-ENABLED
                </span>
              </div>
            </div>
          )}

          {/* Email Headers / Raw Logs */}
          {item.headers && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">TRANSPORT HEADERS</span>
              <div className="bg-[#080808] p-3 rounded border border-[#242424] font-mono-tech text-[11px] text-[#A0A0A0] space-y-1 overflow-x-auto">
                {Object.entries(item.headers).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-white font-semibold">{k}:</span> {v}
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.body && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">MESSAGE BODY</span>
              <div className="bg-[#080808] p-3 rounded border border-[#242424] text-[#F5F5F5] whitespace-pre-line leading-relaxed">
                {item.body}
              </div>
            </div>
          )}

          {item.rawLog && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">RAW SYSLOG / AUDIT TELEMETRY</span>
              <div className="bg-[#080808] p-3 rounded border border-[#242424] font-mono-tech text-[11px] text-[#A0A0A0] whitespace-pre-wrap">
                {item.rawLog}
              </div>
            </div>
          )}

          {item.details && (
            <div>
              <span className="text-[#777777] text-[10px] block mb-1">FORENSIC ANALYSIS NOTES</span>
              <div className="bg-[#141414] p-3 rounded border border-[#242424] text-[#A0A0A0]">
                {item.details}
              </div>
            </div>
          )}

          {item.flag && (
            <div className="bg-[#1C150C] border border-[#451A03] p-3 rounded text-amber-400 space-y-1">
              <span className="text-[10px] font-bold block uppercase tracking-wider">
                HIDDEN CTF EVIDENCE FLAG DISCOVERED:
              </span>
              <code className="text-white font-mono-tech text-xs bg-[#080808] px-2 py-1 rounded border border-[#451A03] block select-all">
                {item.flag}
              </code>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#141414] border-t border-[#242424] px-4 py-3 flex justify-between items-center">
          <button
            onClick={handleConfirmReview}
            disabled={isReviewed}
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center space-x-2 transition-colors ${
              isReviewed
                ? 'bg-[#1E1E1E] text-emerald-400 border border-[#064E3B] cursor-default'
                : 'bg-white text-black hover:bg-[#E5E5E5]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isReviewed ? 'EVIDENCE LOGGED IN CASE (+15 PTS)' : 'LOG AS VERIFIED EVIDENCE'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#242424] text-[#A0A0A0] hover:text-white rounded border border-[#242424] transition-colors"
          >
            CLOSE INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
