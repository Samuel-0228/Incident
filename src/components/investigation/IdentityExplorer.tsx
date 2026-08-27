import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { UserCheck, ShieldAlert, Key, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const IdentityExplorer: React.FC = () => {
  const { identities, selectedIdentity, setSelectedIdentity } = useInvestigation();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-white inline" />
            <span>IDENTITY & ACCESS GOVERNANCE (IAM)</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Active Directory user accounts, credential anomalies, and access privilege levels
          </p>
        </div>

        <div className="text-xs text-[#777777]">
          MONITORED IDENTITIES: <span className="text-white font-bold">{identities.length}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Identities Directory List */}
        <div className="lg:col-span-2 space-y-3">
          {identities.map((id) => {
            const isSelected = selectedIdentity?.username === id.username;
            return (
              <div
                key={id.username}
                onClick={() => setSelectedIdentity(id)}
                className={`bg-[#141414] hover:bg-[#1A1A1A] border p-4 rounded transition-all cursor-pointer space-y-2 ${
                  isSelected ? 'border-white bg-[#1E1E1E]' : 'border-[#242424]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">{id.username}</span>
                    <span className="text-[10px] bg-[#1E1E1E] text-[#A0A0A0] px-2 py-0.5 rounded border border-[#242424]">
                      {id.privilegeLevel}
                    </span>
                  </div>

                  {id.isCompromised ? (
                    <span className="bg-[#1C0D0D] border border-[#450A0A] text-red-400 text-[10px] px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                      <AlertOctagon className="w-3 h-3" />
                      <span>CREDENTIAL COMPROMISED</span>
                    </span>
                  ) : (
                    <span className="bg-[#0D1C16] text-emerald-400 border border-[#064E3B] text-[10px] px-2 py-0.5 rounded font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>NORMAL</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#777777]">ROLE:</span>{' '}
                    <span className="text-[#A0A0A0]">{id.role}</span>
                  </div>
                  <div>
                    <span className="text-[#777777]">LAST LOGIN:</span>{' '}
                    <span className="text-white">{id.lastLogin}</span>
                  </div>
                  <div>
                    <span className="text-[#777777]">NORMAL IP:</span>{' '}
                    <span className="text-white font-mono-tech">{id.normalIp}</span>
                  </div>
                </div>

                {id.suspiciousIp && (
                  <div className="bg-[#1C150C] border border-[#451A03] p-2 rounded text-amber-400 text-[11px] flex justify-between items-center">
                    <span>SUSPICIOUS EXTERNAL AUTHENTICATION DETECTED:</span>
                    <span className="font-bold font-mono-tech text-white bg-[#080808] px-2 py-0.5 rounded border border-[#451A03]">
                      {id.suspiciousIp}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Identity Detailed Inspector */}
        <div className="bg-[#141414] border border-[#242424] p-4 rounded space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2 flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#777777]" />
              <span>IDENTITY AUDIT & AUTH ANOMALIES</span>
            </h2>

            {selectedIdentity ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[#777777] block text-[10px]">ACCOUNT USERNAME</span>
                  <span className="text-white font-bold text-sm">{selectedIdentity.username}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#777777] block text-[10px]">PRIVILEGE LEVEL</span>
                    <span className="text-white font-semibold">{selectedIdentity.privilegeLevel}</span>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[10px]">FAILED LOGINS</span>
                    <span className="text-white font-semibold">{selectedIdentity.failedLogins}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px] mb-1">NORMAL LOGIN LOCATIONS</span>
                  <div className="bg-[#080808] p-2 rounded border border-[#242424] text-emerald-400 font-mono-tech text-[11px]">
                    {selectedIdentity.normalIp}
                  </div>
                </div>

                {selectedIdentity.suspiciousIp && (
                  <div>
                    <span className="text-[#777777] block text-[10px] mb-1 text-red-400 font-bold uppercase">
                      SUSPICIOUS LOGIN IP DETECTED
                    </span>
                    <div className="bg-[#1C0D0D] p-2.5 rounded border border-[#450A0A] text-red-400 font-mono-tech text-[11px] font-bold">
                      {selectedIdentity.suspiciousIp} (TIME: {selectedIdentity.lastLogin})
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[#777777] block text-[10px] mb-1">SYSTEMS ACCESSED</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedIdentity.systemsAccessed.map((sys) => (
                      <span
                        key={sys}
                        className="bg-[#080808] px-2 py-0.5 rounded border border-[#242424] text-white text-[10px]"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px]">RECENT ACTIVITY TRAIL</span>
                  <p className="text-[#A0A0A0] text-xs leading-relaxed bg-[#101010] p-2.5 rounded border border-[#242424] mt-1">
                    {selectedIdentity.recentActivity}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-[#777777] py-12 text-center">
                Select an identity from the directory to inspect credential telemetry.
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#777777] border-t border-[#242424] pt-2">
            Authentication events are cross-referenced with Kerberos domain logs.
          </div>
        </div>
      </div>
    </div>
  );
};
