import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Server, Cpu, ShieldAlert, Wifi, User } from 'lucide-react';

export const EndpointInventory: React.FC = () => {
  const { endpoints, selectedEndpoint, setSelectedEndpoint } = useInvestigation();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <Server className="w-5 h-5 text-white inline" />
            <span>ENDPOINT TELEMETRY & ASSET INVENTORY</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Registered corporate endpoints, OS platform inventory, and compromised vectors
          </p>
        </div>

        <div className="text-xs text-[#777777]">
          TOTAL HOSTS: <span className="text-white font-bold">{endpoints.length}</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Endpoints List */}
        <div className="lg:col-span-2 space-y-3">
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint?.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => setSelectedEndpoint(ep)}
                className={`bg-[#141414] hover:bg-[#1A1A1A] border p-4 rounded transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-white bg-[#1E1E1E]'
                    : 'border-[#242424]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded border ${
                      ep.status === 'COMPROMISED'
                        ? 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                        : ep.status === 'SUSPICIOUS'
                        ? 'bg-[#1C150C] border-[#451A03] text-amber-400'
                        : 'bg-[#0D1626] border-[#1E3A8A] text-emerald-400'
                    }`}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{ep.hostname}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                          ep.status === 'COMPROMISED'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : ep.status === 'SUSPICIOUS'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {ep.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#777777] mt-0.5">
                      IP: <span className="text-[#A0A0A0]">{ep.ip}</span> • OS: <span className="text-[#A0A0A0]">{ep.os}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-[11px] text-[#777777] self-end sm:self-center">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-[#777777]" />
                    <span className="text-white font-semibold">{ep.user}</span>
                  </div>
                  <div>
                    LAST SEEN: <span className="text-white">{ep.lastSeen}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Endpoint Detailed Inspector */}
        <div className="bg-[#141414] border border-[#242424] p-4 rounded space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#777777]" />
              <span>ENDPOINT SECURITY TELEMETRY</span>
            </h2>

            {selectedEndpoint ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[#777777] block text-[10px]">HOSTNAME</span>
                  <span className="text-white font-bold text-sm">{selectedEndpoint.hostname}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#777777] block text-[10px]">IP ADDRESS</span>
                    <span className="text-[#A0A0A0] font-semibold">{selectedEndpoint.ip}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[10px]">ACTIVE USER</span>
                    <span className="text-white font-semibold">{selectedEndpoint.user}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px]">OPERATING SYSTEM PLATFORM</span>
                  <span className="text-white">{selectedEndpoint.os}</span>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px] mb-1">OPEN LISTENING PORTS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEndpoint.openPorts.map((port) => (
                      <span
                        key={port}
                        className="bg-[#080808] px-2 py-0.5 rounded border border-[#242424] text-white text-[10px] font-mono-tech"
                      >
                        PORT {port}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedEndpoint.compromiseVector ? (
                  <div>
                    <span className="text-[#777777] block text-[10px] mb-1 text-red-400 font-bold uppercase">
                      COMPROMISE VECTOR ANALYSIS
                    </span>
                    <p className="text-red-300 text-xs leading-relaxed bg-[#1C0D0D] border border-[#450A0A] p-3 rounded">
                      {selectedEndpoint.compromiseVector}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#0D1C16] border border-[#064E3B] p-3 rounded text-emerald-400 text-xs">
                    No active breach indicators detected on this asset.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[#777777] py-12 text-center">
                Select an endpoint from the asset inventory list to inspect security telemetry.
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#777777] border-t border-[#242424] pt-2">
            Host assets are synchronized with Active Directory Domain Services.
          </div>
        </div>
      </div>
    </div>
  );
};
