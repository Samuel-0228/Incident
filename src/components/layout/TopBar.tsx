import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

export const TopBar: React.FC = () => {
  const { caseStatus, formatElapsedTime, score } = useInvestigation();

  return (
    <header className="h-14 bg-[#101010] border-b border-[#242424] px-4 flex items-center justify-between text-xs font-mono-tech select-none z-20">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse"></span>
          <span className="text-[#A0A0A0] uppercase tracking-wider font-semibold">CICC WORKSTATION</span>
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-[#777777]">
          <div>
            <span className="text-[#777777]">CASE ID: </span>
            <span className="text-[#F5F5F5] font-semibold">INC-2026-0825</span>
          </div>

          <div className="hidden md:block">
            <span className="text-[#777777]">ORG: </span>
            <span className="text-[#A0A0A0]">NORTHSTAR SYSTEMS</span>
          </div>

          <div className="hidden lg:block">
            <span className="text-[#777777]">INCIDENT: </span>
            <span className="text-[#A0A0A0]">SUSPICIOUS INTERNAL ACTIVITY</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-[#777777]">STATUS:</span>
          <span
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold tracking-wider ${
              caseStatus === 'ACTIVE'
                ? 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                : 'bg-[#0D1C16] border-[#064E3B] text-emerald-400'
            }`}
          >
            {caseStatus}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#777777]">ELAPSED:</span>
          <span className="text-[#F5F5F5] font-bold text-sm tracking-wider min-w-[48px] font-mono-tech">
            {formatElapsedTime()}
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-[#141414] px-3 py-1 rounded border border-[#242424]">
          <span className="text-[#777777]">SCORE:</span>
          <span className="text-white font-bold text-sm font-mono-tech">{score}</span>
        </div>
      </div>
    </header>
  );
};
