import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Terminal, Send, HelpCircle, FileText, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const AIAnalystPanel: React.FC = () => {
  const {
    aiMessages,
    isAiAnalyzing,
    askAI,
    getAiHint,
    setSelectedEvidence,
    evidenceItems
  } = useInvestigation();

  const [inputQuery, setInputQuery] = useState<string>('');

  const handleSend = () => {
    if (!inputQuery.trim() || isAiAnalyzing) return;
    askAI(inputQuery);
    setInputQuery('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isAiAnalyzing) return;
    askAI(promptText);
  };

  const handleOpenEvidence = (evId: string) => {
    const item = evidenceItems.find((e) => e.id === evId);
    if (item) {
      setSelectedEvidence(item);
    }
  };

  return (
    <aside className="w-80 bg-[#101010] border-l border-[#242424] flex flex-col justify-between select-none shrink-0 h-full text-xs font-mono-tech">
      {/* Header */}
      <div className="p-3 bg-[#141414] border-b border-[#242424] space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-xs uppercase tracking-wider font-sans">
              INCIDENT ANALYST
            </span>
          </div>
          <span className="text-[10px] bg-[#0D1C16] text-emerald-400 border border-[#064E3B] px-1.5 py-0.2 rounded font-semibold">
            ONLINE
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#777777]">
          <span>MODEL: SOC-REASONER-V4</span>
          <span>CONTEXT: ACTIVE</span>
        </div>
      </div>

      {/* Messages Stream / History */}
      <div className="flex-1 p-3 overflow-y-auto space-y-4">
        <div className="text-[10px] text-[#777777] uppercase tracking-wider font-semibold border-b border-[#242424] pb-1">
          AI FORENSIC ANALYSIS LOG
        </div>

        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded border text-xs space-y-2 ${
              msg.sender === 'ANALYST'
                ? 'bg-[#141414] border-[#242424] text-[#F5F5F5]'
                : 'bg-[#1E1E1E] border-[#3A3A3A] text-white ml-4'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-[#777777] border-b border-[#242424] pb-1">
              <span className="font-semibold uppercase text-white">
                {msg.sender === 'ANALYST' ? 'ANALYST' : 'INVESTIGATOR'}
              </span>
              <span>{msg.timestamp}</span>
            </div>

            <p className="leading-relaxed whitespace-pre-line text-[11px]">{msg.text}</p>

            {/* Evidence Citations */}
            {msg.relevantEvidenceIds && msg.relevantEvidenceIds.length > 0 && (
              <div className="pt-2 border-t border-[#242424] space-y-1">
                <span className="text-[10px] text-[#777777] font-semibold block">
                  RELEVANT EVIDENCE:
                </span>
                <div className="flex flex-wrap gap-1">
                  {msg.relevantEvidenceIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => handleOpenEvidence(id)}
                      className="bg-[#080808] hover:bg-[#1E1E1E] text-amber-400 px-2 py-0.5 rounded border border-[#242424] text-[10px] font-mono-tech transition-colors flex items-center space-x-1"
                    >
                      <FileText className="w-2.5 h-2.5 inline" />
                      <span>{id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Next Step */}
            {msg.recommendedNextStep && (
              <div className="bg-[#080808] p-2 rounded border border-[#242424] text-[10px] text-[#A0A0A0] flex items-center justify-between mt-1">
                <span>REC: {msg.recommendedNextStep}</span>
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}

        {isAiAnalyzing && (
          <div className="bg-[#141414] border border-[#242424] p-3 rounded text-xs text-[#A0A0A0] flex items-center space-x-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span className="font-semibold text-white">ANALYZING CASE EVIDENCE...</span>
          </div>
        )}
      </div>

      {/* Quick Actions & Input Form */}
      <div className="p-3 bg-[#141414] border-t border-[#242424] space-y-2">
        {/* Quick Action Chips */}
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => handleQuickPrompt('Why is this login suspicious?')}
              className="bg-[#101010] hover:bg-[#1E1E1E] text-[#A0A0A0] hover:text-white px-2 py-1 rounded border border-[#242424] text-[10px] transition-colors"
            >
              Why is this login suspicious?
            </button>
            <button
              onClick={() => handleQuickPrompt('Summarize the incident timeline.')}
              className="bg-[#101010] hover:bg-[#1E1E1E] text-[#A0A0A0] hover:text-white px-2 py-1 rounded border border-[#242424] text-[10px] transition-colors"
            >
              Summarize incident
            </button>
            <button
              onClick={() => handleQuickPrompt('What should I investigate next?')}
              className="bg-[#101010] hover:bg-[#1E1E1E] text-[#A0A0A0] hover:text-white px-2 py-1 rounded border border-[#242424] text-[10px] transition-colors"
            >
              What to investigate next?
            </button>
          </div>

          <button
            onClick={getAiHint}
            className="w-full bg-[#1E1E1E] hover:bg-[#242424] text-amber-400 font-semibold py-1 rounded border border-[#3A3A3A] text-[10px] transition-colors flex items-center justify-center space-x-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>ASK ANALYST FOR INVESTIGATION HINT</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-1.5 pt-1">
          <input
            type="text"
            placeholder="Query analyst (e.g., Explain log AUTH-021)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isAiAnalyzing}
            className="flex-1 bg-[#080808] border border-[#242424] focus:border-white px-2.5 py-1.5 rounded text-white text-xs placeholder-[#777777] outline-none font-mono-tech"
          />
          <button
            onClick={handleSend}
            disabled={isAiAnalyzing || !inputQuery.trim()}
            className="p-1.5 bg-white text-black hover:bg-[#E5E5E5] rounded disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
