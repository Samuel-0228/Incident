import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CASE_METADATA } from '../../data/case_2026_0825';

export const BriefingOverlay: React.FC = () => {
  const { activeView, setActiveView } = useInvestigation();
  const [briefingStep, setBriefingStep] = useState<'landing' | 'briefing'>('landing');

  if (activeView !== 'landing' && activeView !== 'briefing') {
    return null;
  }

  const handleEnterCommandCenter = () => {
    setBriefingStep('briefing');
    setActiveView('briefing');
  };

  const handleStartInvestigation = () => {
    setActiveView('overview');
  };

  if (briefingStep === 'landing') {
    return (
      <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-between p-8 font-sans select-none text-[#F5F5F5]">
        <div className="w-full flex justify-between items-center border-b border-[#242424] pb-4 max-w-4xl text-xs font-mono-tech text-[#777777]">
          <span>NORTHSTAR SYSTEMS SOC</span>
          <span>STATION: CICC-TERMINAL-01</span>
        </div>

        <div className="text-center max-w-2xl space-y-8 my-auto">
          <div className="space-y-3">
            <span className="text-xs font-mono-tech tracking-widest text-[#777777] uppercase border border-[#242424] px-3 py-1 rounded">
              CYBERSEC EXHIBITION 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase font-sans mt-4">
              CYBER INCIDENT COMMAND CENTER
            </h1>
            <p className="text-sm font-mono-tech text-[#A0A0A0]">
              A simulated security investigation & digital forensics environment.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs font-mono-tech text-[#777777] border-y border-[#242424] py-4">
            <span className="text-white">INVESTIGATE</span>
            <span>•</span>
            <span className="text-white">ANALYZE</span>
            <span>•</span>
            <span className="text-white">RESPOND</span>
          </div>

          <button
            onClick={handleEnterCommandCenter}
            className="px-8 py-3 bg-[#1A1A1A] hover:bg-[#242424] text-white font-mono-tech text-xs tracking-wider border border-[#3A3A3A] rounded transition-colors uppercase font-semibold"
          >
            [ ENTER COMMAND CENTER ]
          </button>
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-between items-center border-t border-[#242424] pt-4 max-w-4xl text-xs font-mono-tech text-[#777777]">
          <span>CASE: INC-2026-0825</span>
          <span>TARGET: NORTHSTAR SYSTEMS</span>
          <span>SIMULATED INCIDENT DATA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center p-6 font-mono-tech text-[#F5F5F5] select-none">
      <div className="max-w-2xl w-full bg-[#101010] border border-[#242424] p-8 space-y-6">
        <div className="border-b border-[#242424] pb-4 flex justify-between items-baseline">
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">
              {CASE_METADATA.briefing.title}
            </h2>
            <div className="text-xs text-[#777777] mt-1">{CASE_METADATA.briefing.caseId}</div>
          </div>
          <div className="text-xs text-[#A0A0A0]">{CASE_METADATA.organization}</div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-[#A0A0A0]">
          <div className="text-white font-semibold text-xs tracking-wider">
            {CASE_METADATA.briefing.reportHeader}
          </div>
          <div className="whitespace-pre-line text-[#F5F5F5] bg-[#141414] p-4 border border-[#242424] rounded">
            {CASE_METADATA.briefing.bodyText}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-white tracking-wider">
            YOUR INCIDENT OBJECTIVES:
          </div>
          <ul className="text-xs text-[#A0A0A0] space-y-1.5 list-disc list-inside bg-[#141414] p-4 border border-[#242424] rounded">
            {CASE_METADATA.briefing.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-[#242424] flex justify-end">
          <button
            onClick={handleStartInvestigation}
            className="px-6 py-2.5 bg-white text-black hover:bg-[#E5E5E5] text-xs font-semibold tracking-wider rounded transition-colors uppercase"
          >
            [ BEGIN INVESTIGATION ]
          </button>
        </div>
      </div>
    </div>
  );
};
