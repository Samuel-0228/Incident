import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Award, FileText, CheckCircle2, RotateCcw, ShieldCheck, Printer, Download } from 'lucide-react';

export const FinalReportView: React.FC = () => {
  const {
    caseStatus,
    score,
    accuracy,
    formatElapsedTime,
    challenges,
    evidenceReviewedIds,
    resetInvestigation,
    attackChain,
    timeline
  } = useInvestigation();

  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const solvedChallengesCount = challenges.filter((c) => c.solved).length;

  const getRankTitle = (finalScore: number) => {
    if (finalScore >= 1200) return 'SENIOR INCIDENT COMMANDER';
    if (finalScore >= 900) return 'INCIDENT RESPONDER ANALYST';
    return 'SOC TIER 1 DEFENDER';
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white inline" />
            <span>INCIDENT INVESTIGATION REPORT & SCORECARD</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Post-incident forensic report & defender accreditation (CASE INC-2026-0825)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#242424] text-white rounded border border-[#242424] font-semibold transition-colors flex items-center space-x-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{showCertificate ? 'HIDE ACCREDITATION' : 'VIEW ACCREDITATION'}</span>
          </button>
          <button
            onClick={resetInvestigation}
            className="px-4 py-2 bg-white text-black hover:bg-[#E5E5E5] rounded font-bold transition-colors flex items-center space-x-2 uppercase"
          >
            <RotateCcw className="w-4 h-4" />
            <span>[ START NEW INCIDENT ]</span>
          </button>
        </div>
      </div>

      {showCertificate ? (
        /* Certificate View */
        <div className="bg-[#101010] border-2 border-white p-8 rounded-lg max-w-3xl mx-auto space-y-6 text-center shadow-2xl">
          <div className="border-b border-[#242424] pb-4 space-y-1">
            <div className="text-xs text-[#777777] tracking-widest uppercase">
              NORTHSTAR SYSTEMS • CYBER INCIDENT COMMAND CENTER
            </div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase font-sans">
              CERTIFICATE OF INCIDENT RESOLUTION
            </h2>
          </div>

          <div className="space-y-3 py-4">
            <p className="text-[#A0A0A0] text-xs">This certifies that the investigator has successfully resolved</p>
            <div className="text-lg font-bold text-white font-mono-tech">
              CASE INC-2026-0825: SUSPICIOUS INTERNAL ACTIVITY
            </div>
            <p className="text-[#777777] text-xs max-w-lg mx-auto">
              Attacker IP 185.44.91.20 was contained, compromised identity finance01 secured, and all exfiltration channels severed.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-[#141414] p-4 rounded border border-[#242424] text-center">
            <div>
              <span className="text-[#777777] text-[10px] block uppercase">CYBER DEFENDER SCORE</span>
              <span className="text-white font-bold text-base">{score}</span>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] block uppercase">ACCURACY</span>
              <span className="text-emerald-400 font-bold text-base">{accuracy}%</span>
            </div>
            <div>
              <span className="text-[#777777] text-[10px] block uppercase">ASSIGNED RANK</span>
              <span className="text-amber-400 font-bold text-xs">{getRankTitle(score)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#777777] pt-4 border-t border-[#242424]">
            <span>VERIFIED BY: CICC AUTOMATED EVALUATOR</span>
            <span>DATE: 2026-08-25 UTC</span>
          </div>
        </div>
      ) : (
        /* Report View */
        <div className="space-y-6">
          {/* Executive Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scorecard Box */}
            <div className="bg-[#141414] border border-[#242424] p-5 rounded space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[#777777] text-[10px] uppercase font-semibold">FINAL INCIDENT SCORE</div>
                <div className="text-3xl font-bold text-white font-mono-tech">{score}</div>
                <div className="text-[#A0A0A0] text-xs font-semibold">
                  RANK: <span className="text-amber-400">{getRankTitle(score)}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#242424] pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#777777]">INVESTIGATION ACCURACY:</span>
                  <span className="text-emerald-400 font-semibold">{accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">CHALLENGES SOLVED:</span>
                  <span className="text-white font-semibold">{solvedChallengesCount} / 8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">EVIDENCE REVIEWED:</span>
                  <span className="text-white font-semibold">{evidenceReviewedIds.size} / 27</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">RESPONSE TIME:</span>
                  <span className="text-white font-semibold">{formatElapsedTime()}</span>
                </div>
              </div>
            </div>

            {/* Case Findings Summary */}
            <div className="md:col-span-2 bg-[#141414] border border-[#242424] p-5 rounded space-y-4">
              <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>EXECUTIVE INCIDENT FINDINGS</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#080808] p-3 rounded border border-[#242424]">
                  <span className="text-[#777777] block text-[10px]">INITIAL ACCESS VECTOR</span>
                  <span className="text-white font-semibold">Phishing Spear Attachment (Payroll_Update.xlsm)</span>
                </div>
                <div className="bg-[#080808] p-3 rounded border border-[#242424]">
                  <span className="text-[#777777] block text-[10px]">COMPROMISED ACCOUNT</span>
                  <span className="text-red-400 font-semibold">finance01 (Senior Financial Analyst)</span>
                </div>
                <div className="bg-[#080808] p-3 rounded border border-[#242424]">
                  <span className="text-[#777777] block text-[10px]">ATTACKER C2 IP</span>
                  <span className="text-amber-400 font-mono-tech font-semibold">185.44.91.20</span>
                </div>
                <div className="bg-[#080808] p-3 rounded border border-[#242424]">
                  <span className="text-[#777777] block text-[10px]">TARGET EXFILTRATION FILE</span>
                  <span className="text-white font-semibold">FINANCE_EXPORT_2026.zip (482 MB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reconstructed Attack Timeline Summary */}
          <div className="bg-[#141414] border border-[#242424] p-5 rounded space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2">
              RECONSTRUCTED ATTACK TIMELINE SUMMARY
            </h2>

            <div className="space-y-2">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#080808] p-3 rounded border border-[#242424] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[#777777] font-semibold">{event.timestamp}</span>
                    <span className="text-white font-semibold">{event.description}</span>
                  </div>
                  <span className="text-[10px] text-[#A0A0A0] bg-[#141414] px-2 py-0.5 rounded border border-[#242424]">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
