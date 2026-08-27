import React, { useState } from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { BriefingOverlay } from './components/layout/BriefingOverlay';
import { IncidentOverview } from './components/dashboard/IncidentOverview';
import { IncidentTimeline } from './components/investigation/IncidentTimeline';
import { EvidenceExplorer } from './components/investigation/EvidenceExplorer';
import { MalwareSimulator } from './components/investigation/MalwareSimulator';
import { FilesystemExplorer } from './components/investigation/FilesystemExplorer';
import { NetworkTopology } from './components/investigation/NetworkTopology';
import { EndpointInventory } from './components/investigation/EndpointInventory';
import { IdentityExplorer } from './components/investigation/IdentityExplorer';
import { ChallengeBoard } from './components/ctf/ChallengeBoard';
import { AttackChainTracker } from './components/response/AttackChainTracker';
import { DecisionModal } from './components/response/DecisionModal';
import { AIAnalystPanel } from './components/ai/AIAnalystPanel';
import { FinalReportView } from './components/report/FinalReportView';
import { Menu, Bot, X } from 'lucide-react';

const WorkstationContent: React.FC = () => {
  const { activeView } = useInvestigation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <IncidentOverview />;
      case 'timeline':
        return <IncidentTimeline />;
      case 'evidence':
        return <EvidenceExplorer />;
      case 'malware':
        return <MalwareSimulator />;
      case 'filesystem':
        return <FilesystemExplorer />;
      case 'network':
        return <NetworkTopology />;
      case 'endpoints':
        return <EndpointInventory />;
      case 'identities':
        return <IdentityExplorer />;
      case 'challenges':
        return <ChallengeBoard />;
      case 'attack-chain':
        return <AttackChainTracker />;
      case 'report':
        return <FinalReportView />;
      default:
        return <IncidentOverview />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#080808] text-[#F5F5F5] overflow-hidden select-none">
      {/* Landing & Cinematic Briefing Overlay */}
      <BriefingOverlay />

      {/* Decision Prompt Modal */}
      <DecisionModal />

      {/* Top Command Bar */}
      <TopBar />

      {/* Mobile Header Toggle Bar */}
      <div className="lg:hidden bg-[#101010] border-b border-[#242424] px-4 py-2 flex justify-between items-center text-xs font-mono-tech">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center space-x-1.5 text-[#A0A0A0] hover:text-white px-2 py-1 bg-[#141414] rounded border border-[#242424]"
        >
          <Menu className="w-4 h-4" />
          <span>NAV</span>
        </button>

        <span className="font-bold text-white uppercase tracking-wider">{activeView}</span>

        <button
          onClick={() => setMobileAiOpen(!mobileAiOpen)}
          className="flex items-center space-x-1.5 text-[#A0A0A0] hover:text-white px-2 py-1 bg-[#141414] rounded border border-[#242424]"
        >
          <Bot className="w-4 h-4" />
          <span>ANALYST</span>
        </button>
      </div>

      {/* Main Workstation Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar / Mobile Drawer */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 z-30 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar />
        </div>

        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* Center Main Investigation View */}
        <main className="flex-1 overflow-hidden bg-[#080808] relative">
          {renderActiveView()}
        </main>

        {/* Desktop Right AI Analyst Panel / Mobile Drawer */}
        <div
          className={`fixed lg:relative inset-y-0 right-0 z-30 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            mobileAiOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <AIAnalystPanel />
        </div>

        {/* Backdrop for mobile AI drawer */}
        {mobileAiOpen && (
          <div
            onClick={() => setMobileAiOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}
      </div>
    </div>
  );
};

export function App() {
  return (
    <InvestigationProvider>
      <WorkstationContent />
    </InvestigationProvider>
  );
}

export default App;
