import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { NetworkNode } from '../../types/investigation';
import { Network, Server, ShieldAlert, Cpu, Globe, Database, HardDrive, ArrowRight } from 'lucide-react';

export const NetworkTopology: React.FC = () => {
  const { networkNodes, selectedNetworkNode, setSelectedNetworkNode } = useInvestigation();

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'internet':
        return Globe;
      case 'server':
        return Server;
      case 'database':
        return Database;
      case 'workstation':
        return Cpu;
      default:
        return HardDrive;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <Network className="w-5 h-5 text-white inline" />
            <span>2D NETWORK TOPOLOGY & EGRESS TELEMETRY</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Internal corporate subnet layout & inter-node session map (10.42.0.0/16)
          </p>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[#A0A0A0]">NORMAL</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-[#A0A0A0]">SUSPICIOUS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-status-pulse"></span>
            <span className="text-[#A0A0A0]">COMPROMISED</span>
          </div>
        </div>
      </div>

      {/* Main Grid: SVG Topology + Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 2D Interactive SVG Network Map */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#242424] p-6 rounded relative min-h-[420px] flex flex-col justify-between">
          <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider mb-2">
            TOPOLOGY GRAPH (CLICK NODE TO INSPECT TELEMETRY)
          </div>

          {/* SVG Diagram Connections */}
          <div className="relative w-full h-[360px] border border-[#242424] bg-[#080808] rounded p-4 flex flex-col justify-between overflow-hidden">
            {/* Top Level: External Internet & Mail GW */}
            <div className="flex justify-between items-center px-8">
              {networkNodes.slice(0, 2).map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNetworkNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNetworkNode(node)}
                    className={`p-3 rounded border flex items-center space-x-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1E1E1E] border-white text-white ring-1 ring-white'
                        : 'bg-[#101010] hover:bg-[#1A1A1A] border-[#242424]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${node.status === 'COMPROMISED' ? 'text-red-400' : 'text-amber-400'}`} />
                    <div>
                      <div className="font-bold text-white text-xs">{node.label}</div>
                      <div className="text-[10px] text-[#777777]">{node.ip}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connection Line */}
            <div className="w-full flex justify-center py-2">
              <div className="h-8 w-0.5 bg-[#242424] border-l border-dashed border-[#3A3A3A]"></div>
            </div>

            {/* Mid Level: Primary Compromised Workstation FINANCE-02 */}
            <div className="flex justify-center">
              {networkNodes.slice(2, 3).map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNetworkNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNetworkNode(node)}
                    className={`p-3.5 rounded border flex items-center space-x-3 cursor-pointer transition-all shadow-lg ${
                      isSelected
                        ? 'bg-[#1E1E1E] border-white text-white ring-1 ring-white'
                        : 'bg-[#1A0E0E] hover:bg-[#241212] border-red-900/60'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                        <span>{node.label}</span>
                        <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1 py-0.2 rounded font-semibold">
                          PRIMARY TARGET
                        </span>
                      </div>
                      <div className="text-[10px] text-red-300/70">{node.ip}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connection Lines Branching out */}
            <div className="w-full flex justify-center py-2">
              <div className="h-8 w-0.5 bg-[#242424] border-l border-dashed border-[#3A3A3A]"></div>
            </div>

            {/* Bottom Level: Internal Network Cluster (DC-01, FILE-01, DB-01, BACKUP-01) */}
            <div className="grid grid-cols-4 gap-2">
              {networkNodes.slice(3).map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNetworkNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNetworkNode(node)}
                    className={`p-2.5 rounded border flex flex-col items-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1E1E1E] border-white text-white ring-1 ring-white'
                        : 'bg-[#101010] hover:bg-[#1A1A1A] border-[#242424]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1 ${
                        node.status === 'COMPROMISED'
                          ? 'text-red-400'
                          : node.status === 'SUSPICIOUS'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    />
                    <div className="font-bold text-white text-[11px]">{node.label}</div>
                    <div className="text-[9px] text-[#777777] mt-0.5">{node.ip}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Telemetry Inspector */}
        <div className="bg-[#141414] border border-[#242424] p-4 rounded space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#777777]" />
              <span>NODE TELEMETRY INSPECTOR</span>
            </h2>

            {selectedNetworkNode ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[#777777] block text-[10px]">HOSTNAME / IDENTIFIER</span>
                  <span className="text-white font-bold text-sm">{selectedNetworkNode.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#777777] block text-[10px]">IP ADDRESS</span>
                    <span className="text-white font-semibold font-mono-tech">
                      {selectedNetworkNode.ip}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[10px]">SECURITY STATUS</span>
                    <span
                      className={`font-semibold text-xs ${
                        selectedNetworkNode.status === 'COMPROMISED'
                          ? 'text-red-400'
                          : selectedNetworkNode.status === 'SUSPICIOUS'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedNetworkNode.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px]">OPERATING SYSTEM</span>
                  <span className="text-[#A0A0A0] font-semibold">{selectedNetworkNode.os}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#080808] p-2.5 rounded border border-[#242424]">
                  <div>
                    <span className="text-[#777777] block text-[10px]">LAST ACTIVE</span>
                    <span className="text-white">{selectedNetworkNode.lastActivity}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[10px]">AUTH EVENTS</span>
                    <span className="text-white">{selectedNetworkNode.authEvents}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px] mb-1">INTER-NODE CONNECTIONS</span>
                  <div className="space-y-1">
                    {selectedNetworkNode.connections.map((conn) => (
                      <div
                        key={conn}
                        className="bg-[#101010] p-2 rounded border border-[#242424] text-white flex items-center justify-between"
                      >
                        <span>{conn}</span>
                        <ArrowRight className="w-3 h-3 text-[#777777]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px]">ANALYSIS SUMMARY</span>
                  <p className="text-[#A0A0A0] text-xs leading-relaxed bg-[#101010] p-2.5 rounded border border-[#242424] mt-1">
                    {selectedNetworkNode.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-[#777777] py-12 text-center">
                Select a network node from the topology diagram to inspect telemetry.
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#777777] border-t border-[#242424] pt-2">
            Network connections map real-time session logs recorded by perimeter firewalls.
          </div>
        </div>
      </div>
    </div>
  );
};
