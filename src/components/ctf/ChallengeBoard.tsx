import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CTFChallenge } from '../../types/investigation';
import { Flag, HelpCircle, CheckCircle2, AlertCircle, Award, Eye } from 'lucide-react';

export const ChallengeBoard: React.FC = () => {
  const {
    challenges,
    submitFlag,
    requestHint,
    score,
    setSelectedEvidence,
    evidenceItems,
    setActiveView
  } = useInvestigation();

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [feedbackMessages, setFeedbackMessages] = useState<Record<string, { success: boolean; text: string }>>({});

  const handleInputChange = (id: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = (challengeId: string) => {
    const input = inputValues[challengeId] || '';
    if (!input.trim()) return;

    const result = submitFlag(challengeId, input);
    setFeedbackMessages((prev) => ({
      ...prev,
      [challengeId]: { success: result.success, text: result.message }
    }));
  };

  const handleHintClick = (challengeId: string) => {
    const hintRes = requestHint(challengeId);
    if (hintRes) {
      setFeedbackMessages((prev) => ({
        ...prev,
        [challengeId]: {
          success: true,
          text: `HINT UNLOCKED (LEVEL ${hintRes.level}): ${hintRes.hintText} (-${hintRes.penalty} POINTS)`
        }
      }));
    }
  };

  const handleViewEvidenceClick = (evId: string) => {
    const item = evidenceItems.find((e) => e.id === evId);
    if (item) {
      setSelectedEvidence(item);
    } else {
      setActiveView('evidence');
    }
  };

  const solvedCount = challenges.filter((c) => c.solved).length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <Flag className="w-5 h-5 text-white inline" />
            <span>CAPTURE-THE-FLAG (CTF) INVESTIGATION CHALLENGES</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Validate findings, submit recovered evidence flags, and earn investigation score
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-[#141414] px-4 py-2 rounded border border-[#242424]">
          <div className="text-center">
            <span className="text-[#777777] text-[10px] block uppercase">SOLVED</span>
            <span className="text-white font-bold text-sm">{solvedCount} / 8</span>
          </div>
          <div className="h-6 w-px bg-[#242424]"></div>
          <div className="text-center">
            <span className="text-[#777777] text-[10px] block uppercase">CURRENT SCORE</span>
            <span className="text-emerald-400 font-bold text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((ch) => {
          const feedback = feedbackMessages[ch.id];

          return (
            <div
              key={ch.id}
              className={`bg-[#141414] border p-5 rounded space-y-4 flex flex-col justify-between transition-all ${
                ch.solved ? 'border-[#064E3B] bg-[#0D1C16]/20' : 'border-[#242424]'
              }`}
            >
              <div className="space-y-3">
                {/* Challenge Header */}
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-white font-bold text-sm font-sans">
                      CHALLENGE {ch.number}: {ch.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        ch.difficulty === 'EASY'
                          ? 'bg-[#0D1626] border border-[#1E3A8A] text-blue-400'
                          : ch.difficulty === 'MEDIUM'
                          ? 'bg-[#1C150C] border border-[#451A03] text-amber-400'
                          : 'bg-[#1C0D0D] border border-[#450A0A] text-red-400'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                    <span className="text-emerald-400 font-bold text-xs bg-[#080808] px-2 py-0.5 rounded border border-[#242424]">
                      +{ch.points} PTS
                    </span>
                  </div>
                </div>

                <p className="text-[#A0A0A0] text-xs leading-relaxed">{ch.description}</p>

                <div className="bg-[#080808] p-3 rounded border border-[#242424] space-y-1">
                  <span className="text-[#777777] text-[10px] font-bold block uppercase">
                    OBJECTIVE:
                  </span>
                  <span className="text-[#F5F5F5] text-xs font-semibold">{ch.objective}</span>
                </div>

                {/* Available Evidence References */}
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="text-[#777777]">ASSOCIATED EVIDENCE:</span>
                  <div className="flex flex-wrap gap-1">
                    {ch.availableEvidence.map((ev) => (
                      <button
                        key={ev}
                        onClick={() => handleViewEvidenceClick(ev)}
                        className="bg-[#1E1E1E] hover:bg-[#242424] text-white px-2 py-0.5 rounded border border-[#242424] transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-2.5 h-2.5" />
                        <span>{ev}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Solved Status or Input Form */}
              <div className="space-y-3 pt-2 border-t border-[#242424]">
                {ch.solved ? (
                  <div className="bg-[#0D1C16] border border-[#064E3B] p-3 rounded flex items-center justify-between text-emerald-400 font-bold text-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>CHALLENGE SOLVED (+{ch.points} PTS)</span>
                    </div>
                    <span className="text-[10px] text-[#A0A0A0] font-mono-tech">FLAG VERIFIED</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Enter Flag or Answer (e.g. 185.44.91.20 or FLAG{...})"
                        value={inputValues[ch.id] || ''}
                        onChange={(e) => handleInputChange(ch.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(ch.id)}
                        className="flex-1 bg-[#080808] border border-[#242424] focus:border-white px-3 py-2 rounded text-white text-xs placeholder-[#777777] outline-none font-mono-tech"
                      />
                      <button
                        onClick={() => handleSubmit(ch.id)}
                        className="px-4 py-2 bg-white text-black hover:bg-[#E5E5E5] font-semibold text-xs rounded transition-colors uppercase"
                      >
                        SUBMIT
                      </button>
                    </div>

                    {/* Hint Button */}
                    <div className="flex justify-between items-center text-[10px]">
                      <button
                        onClick={() => handleHintClick(ch.id)}
                        className="text-[#777777] hover:text-amber-400 flex items-center space-x-1 transition-colors"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>
                          REQUEST HINT (LEVEL {ch.hintsUsedCount + 1}/{ch.hints.length}) [-25 PTS]
                        </span>
                      </button>

                      {ch.hintsUsedCount > 0 && (
                        <span className="text-amber-400">
                          {ch.hintsUsedCount} HINT(S) REVEALED
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback Toast */}
                {feedback && (
                  <div
                    className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                      feedback.success
                        ? 'bg-[#0D1C16] border-[#064E3B] text-emerald-400'
                        : 'bg-[#1C0D0D] border-[#450A0A] text-red-400'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
