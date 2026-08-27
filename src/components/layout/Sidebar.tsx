import React from 'react';
import { useInvestigation, NavView } from '../../context/InvestigationContext';
import {
  LayoutDashboard,
  Clock,
  FileSearch,
  Network,
  Server,
  UserCheck,
  Flag,
  GitCommit,
  FileText
} from 'lucide-react';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, caseStatus, challenges } = useInvestigation();

  const solvedChallengesCount = challenges.filter((c) => c.solved).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'timeline', label: 'TIMELINE', icon: Clock },
    { id: 'evidence', label: 'EVIDENCE', icon: FileSearch, badge: '27' },
    { id: 'network', label: 'NETWORK', icon: Network },
    { id: 'endpoints', label: 'ENDPOINTS', icon: Server },
    { id: 'identities', label: 'IDENTITIES', icon: UserCheck },
    { id: 'challenges', label: 'CHALLENGES', icon: Flag, badge: `${solvedChallengesCount}/8` },
    { id: 'attack-chain', label: 'ATTACK CHAIN', icon: GitCommit },
    { id: 'report', label: 'REPORT', icon: FileText }
  ];

  return (
    <aside className="w-56 bg-[#101010] border-r border-[#242424] flex flex-col justify-between select-none shrink-0 h-full">
      <div>
        {/* Header Branding */}
        <div className="p-4 border-b border-[#242424]">
          <div className="text-[10px] font-mono-tech text-[#777777] tracking-widest uppercase">CYBER</div>
          <div className="text-sm font-bold tracking-tight text-white font-sans mt-0.5">
            INCIDENT COMMAND
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono-tech text-[#777777] tracking-wider uppercase font-semibold">
            INCIDENT WORKSTATION
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono-tech transition-colors rounded ${
                    isActive
                      ? 'bg-[#1E1E1E] text-white font-semibold border-l-2 border-white pl-2.5'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#777777]'}`} />
                    <span className="tracking-wider">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono-tech ${
                        isActive
                          ? 'bg-[#242424] text-white'
                          : 'bg-[#141414] text-[#777777] border border-[#242424]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom System Status Widget */}
      <div className="p-3 m-2 bg-[#141414] border border-[#242424] rounded text-[11px] font-mono-tech space-y-1.5">
        <div className="text-[#777777] uppercase text-[10px] tracking-wider font-semibold border-b border-[#242424] pb-1">
          SYSTEM STATUS
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">CASE:</span>
          <span className="text-white font-semibold">INC-2026-0825</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">STATUS:</span>
          <span className={caseStatus === 'ACTIVE' ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {caseStatus === 'ACTIVE' ? 'ACTIVE INCIDENT' : 'CONTAINED'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">DIFFICULTY:</span>
          <span className="text-[#A0A0A0]">ADVANCED</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">TIME:</span>
          <span className="text-white">09:42 UTC</span>
        </div>
      </div>
    </aside>
  );
};
