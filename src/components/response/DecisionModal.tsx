import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { AlertOctagon, Shield, AlertTriangle } from 'lucide-react';

export const DecisionModal: React.FC = () => {
  const { activeDecision, makeDecision } = useInvestigation();

  if (!activeDecision) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-mono-tech select-none">
      <div className="bg-[#101010] border-2 border-red-900/80 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center space-x-3 border-b border-[#242424] pb-4">
          <div className="p-2.5 bg-[#1C0D0D] border border-[#450A0A] rounded text-red-400">
            <AlertOctagon className="w-6 h-6 animate-status-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider uppercase font-sans">
              {activeDecision.title}
            </h2>
            <span className="text-[10px] text-red-400 font-semibold tracking-widest uppercase">
              IMMEDIATE COMMAND DECISION REQUIRED
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#141414] p-4 rounded border border-[#242424] text-xs text-[#F5F5F5] leading-relaxed">
          {activeDecision.description}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-[10px] text-[#777777] font-semibold tracking-wider uppercase">
            SELECT ACTION PROTOCOL:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {activeDecision.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => makeDecision(opt.id)}
                className="w-full bg-[#141414] hover:bg-[#1E1E1E] border border-[#242424] hover:border-white p-3.5 rounded text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-[#777777] group-hover:text-white" />
                  <div>
                    <div className="font-bold text-white text-xs tracking-wider group-hover:text-white">
                      [ {opt.label} ]
                    </div>
                    <div className="text-[10px] text-[#777777] mt-0.5">{opt.actionName}</div>
                  </div>
                </div>

                <span className="text-[10px] text-[#777777] group-hover:text-white font-semibold uppercase border border-[#242424] group-hover:border-white px-2 py-1 rounded">
                  EXECUTE PROTOCOL
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-[#777777] text-center pt-2 border-t border-[#242424]">
          Decisions directly affect incident containment status and final score metrics.
        </div>
      </div>
    </div>
  );
};
