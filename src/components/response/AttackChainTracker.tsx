import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { GitCommit, Lock, CheckCircle2, ShieldCheck, ArrowDown } from 'lucide-react';

export const AttackChainTracker: React.FC = () => {
  const { attackChain, setSelectedEvidence, evidenceItems, setActiveView } = useInvestigation();

  const handleEvidenceClick = (evidenceId: string) => {
    const item = evidenceItems.find((e) => e.id === evidenceId);
    if (item) {
      setSelectedEvidence(item);
    } else {
      setActiveView('evidence');
    }
  };

  const unlockedCount = attackChain.filter((s) => s.unlocked).length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-white inline" />
            <span>ATTACK CHAIN RECONSTRUCTION</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Sequential threat actor kill-chain mapping derived from verified forensic artifacts
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#141414] px-4 py-2 rounded border border-[#242424]">
          <span className="text-[#777777]">UNLOCKED STAGES:</span>
          <span className="text-white font-bold text-sm">
            {unlockedCount} / {attackChain.length}
          </span>
        </div>
      </div>

      {/* Sequential Attack Chain Flow */}
      <div className="max-w-4xl mx-auto space-y-3">
        {attackChain.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div
              className={`border p-4 rounded transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                stage.unlocked
                  ? 'bg-[#141414] border-[#242424]'
                  : 'bg-[#0A0A0A] border-[#1E1E1E] opacity-60'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs ${
                    stage.unlocked
                      ? 'bg-[#1E1E1E] border-white text-white'
                      : 'bg-[#101010] border-[#242424] text-[#777777]'
                  }`}
                >
                  0{idx + 1}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-sm font-sans">{stage.stageName}</h3>
                    {stage.unlocked ? (
                      <span className="text-emerald-400 text-[10px] bg-[#0D1C16] border border-[#064E3B] px-2 py-0.2 rounded font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>RECONSTRUCTED</span>
                      </span>
                    ) : (
                      <span className="text-[#777777] text-[10px] bg-[#141414] border border-[#242424] px-2 py-0.2 rounded flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>STAGE LOCKED</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[#A0A0A0] text-xs mt-1 leading-relaxed">
                    {stage.unlocked
                      ? stage.description
                      : 'Investigate evidence items and solve CTF challenges to unlock this attack vector stage.'}
                  </p>
                </div>
              </div>

              {stage.unlocked && (
                <div className="flex items-center space-x-3 self-end md:self-center">
                  <span className="text-[#777777] text-[10px]">{stage.timestamp}</span>
                  <button
                    onClick={() => handleEvidenceClick(stage.evidenceRef)}
                    className="bg-[#1E1E1E] hover:bg-[#242424] text-white px-2.5 py-1 rounded border border-[#242424] text-[10px] transition-colors"
                  >
                    [{stage.evidenceRef}]
                  </button>
                </div>
              )}
            </div>

            {idx < attackChain.length - 1 && (
              <div className="flex justify-center my-1">
                <ArrowDown className="w-4 h-4 text-[#3A3A3A]" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
