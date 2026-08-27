import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ShieldAlert, Server, Users, FileSearch, Flag, Award, Activity, ArrowRight } from 'lucide-react';

export const IncidentOverview: React.FC = () => {
  const {
    caseStatus,
    score,
    timeline,
    setActiveView,
    setSelectedEvidence,
    evidenceItems,
    challenges
  } = useInvestigation();

  const solvedChallengesCount = challenges.filter((c) => c.solved).length;

  const handleEventClick = (evidenceId?: string) => {
    if (evidenceId) {
      const ev = evidenceItems.find((e) => e.id === evidenceId);
      if (ev) {
        setSelectedEvidence(ev);
      }
    }
    setActiveView('timeline');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Page Title */}
      <div className="flex justify-between items-center border-b border-[#242424] pb-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans">
            INCIDENT OVERVIEW
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Active Security Operations Center (SOC) Case Telemetry
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[#777777]">
          <span>TARGET SYSTEM:</span>
          <span className="text-white font-semibold">NORTHSTAR NETWORKS</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">STATUS</div>
          <div
            className={`font-bold text-sm ${
              caseStatus === 'ACTIVE' ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {caseStatus}
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">SEVERITY</div>
          <div className="font-bold text-sm text-red-400 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 inline" />
            <span>HIGH</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">AFFECTED HOSTS</div>
          <div className="font-bold text-sm text-white flex items-center space-x-1">
            <Server className="w-3.5 h-3.5 text-[#777777]" />
            <span>6</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">COMPROMISED USERS</div>
          <div className="font-bold text-sm text-amber-400 flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-[#777777]" />
            <span>2</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">EVIDENCE ITEMS</div>
          <div className="font-bold text-sm text-white flex items-center space-x-1">
            <FileSearch className="w-3.5 h-3.5 text-[#777777]" />
            <span>27</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">CHALLENGES</div>
          <div className="font-bold text-sm text-white flex items-center space-x-1">
            <Flag className="w-3.5 h-3.5 text-[#777777]" />
            <span>{solvedChallengesCount} / 8</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-3 rounded space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[#777777] text-[10px] uppercase font-semibold">CURRENT SCORE</div>
          <div className="font-bold text-sm text-white flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-[#777777]" />
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* Large ATTACK ACTIVITY Timeline Section */}
      <div className="bg-[#141414] border border-[#242424] rounded p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-[#242424] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-white" />
            <h2 className="font-bold text-white text-xs tracking-wider uppercase font-sans">
              ATTACK ACTIVITY CHRONOLOGY
            </h2>
          </div>
          <button
            onClick={() => setActiveView('timeline')}
            className="text-[#A0A0A0] hover:text-white flex items-center space-x-1 text-xs transition-colors"
          >
            <span>VIEW FULL FORENSIC TIMELINE</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {timeline.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event.evidenceId)}
              className="bg-[#101010] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#3A3A3A] p-3 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#777777] font-semibold text-xs min-w-[70px]">
                  {event.timestamp}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                    event.severity === 'CRITICAL'
                      ? 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                      : event.severity === 'HIGH'
                      ? 'bg-[#1C150C] border-[#451A03] text-amber-400'
                      : 'bg-[#0D1626] border-[#1E3A8A] text-blue-400'
                  }`}
                >
                  {event.type}
                </span>
                <span className="text-[#F5F5F5] font-semibold text-xs group-hover:text-white">
                  {event.description}
                </span>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <span className="text-[#777777] text-[11px] font-mono-tech hidden lg:inline">
                  {event.source} → {event.destination}
                </span>
                {event.evidenceId && (
                  <span className="text-[10px] bg-[#1E1E1E] text-[#A0A0A0] group-hover:text-white px-2 py-0.5 rounded border border-[#242424]">
                    [{event.evidenceId}]
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
