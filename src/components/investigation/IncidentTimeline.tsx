import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EvidenceCategory, TimelineEvent } from '../../types/investigation';
import { EvidenceViewerModal } from './EvidenceViewerModal';
import { Filter, Eye, Clock } from 'lucide-react';

export const IncidentTimeline: React.FC = () => {
  const {
    timeline,
    timelineFilter,
    setTimelineFilter,
    selectedEvidence,
    setSelectedEvidence,
    evidenceItems
  } = useInvestigation();

  const filterCategories: EvidenceCategory[] = [
    'ALL',
    'AUTH',
    'NETWORK',
    'FILES',
    'IDENTITY',
    'ENDPOINT',
    'EMAIL'
  ];

  const filteredTimeline = timeline.filter((event) => {
    if (timelineFilter === 'ALL') return true;
    return event.category === timelineFilter;
  });

  const handleOpenEvidence = (event: TimelineEvent) => {
    if (event.evidenceId) {
      const item = evidenceItems.find((e) => e.id === event.evidenceId);
      if (item) {
        setSelectedEvidence(item);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <Clock className="w-5 h-5 text-white inline" />
            <span>FORENSIC INCIDENT TIMELINE</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Chronological audit log of security events & telemetry reconstruction
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 bg-[#141414] p-1.5 rounded border border-[#242424] overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#777777] ml-1 mr-1 shrink-0" />
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setTimelineFilter(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shrink-0 ${
                timelineFilter === cat
                  ? 'bg-white text-black font-bold'
                  : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forensic Timeline List */}
      <div className="relative border-l border-[#242424] ml-3 pl-6 space-y-4">
        {filteredTimeline.map((event) => {
          const associatedEvidence = evidenceItems.find((e) => e.id === event.evidenceId);
          return (
            <div key={event.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[31px] top-3.5 w-2.5 h-2.5 rounded-full border-2 bg-[#080808] ${
                  event.severity === 'CRITICAL'
                    ? 'border-red-500'
                    : event.severity === 'HIGH'
                    ? 'border-amber-500'
                    : 'border-blue-500'
                }`}
              />

              {/* Event Card */}
              <div className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#3A3A3A] p-4 rounded transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242424] pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-bold text-xs bg-[#080808] px-2 py-0.5 rounded border border-[#242424]">
                      {event.timestamp} UTC
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                        event.severity === 'CRITICAL'
                          ? 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                          : event.severity === 'HIGH'
                          ? 'bg-[#1C150C] border-[#451A03] text-amber-400'
                          : 'bg-[#0D1626] border-[#1E3A8A] text-blue-400'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>

                  <div className="text-[#777777] text-[11px]">
                    <span className="text-[#A0A0A0] font-semibold">{event.source}</span>
                    <span className="mx-1.5">→</span>
                    <span className="text-[#A0A0A0] font-semibold">{event.destination}</span>
                  </div>
                </div>

                <div className="text-[#F5F5F5] font-semibold text-xs leading-relaxed">
                  {event.description}
                </div>

                {/* Evidence link & metadata footer */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div className="text-[#777777]">
                    CATEGORY: <span className="text-[#A0A0A0] font-semibold">{event.category}</span>
                  </div>

                  {associatedEvidence && (
                    <button
                      onClick={() => handleOpenEvidence(event)}
                      className="px-3 py-1 bg-[#1E1E1E] hover:bg-[#242424] text-white rounded border border-[#242424] transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3 h-3 text-[#A0A0A0]" />
                      <span>[ VIEW EVIDENCE ({associatedEvidence.id}) ]</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Inspector */}
      <EvidenceViewerModal item={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
    </div>
  );
};
