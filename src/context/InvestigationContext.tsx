import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TimelineEvent,
  EvidenceItem,
  EvidenceCategory,
  MalwareAnalysis,
  VirtualFile,
  NetworkNode,
  Endpoint,
  Identity,
  CTFChallenge,
  AttackStage,
  DecisionPrompt,
  AIMessage
} from '../types/investigation';
import {
  CASE_METADATA,
  INITIAL_TIMELINE,
  INITIAL_EVIDENCE,
  MALWARE_SAMPLE,
  VIRTUAL_FILESYSTEM,
  NETWORK_NODES,
  ENDPOINTS,
  IDENTITIES,
  CTF_CHALLENGES,
  ATTACK_CHAIN_STAGES,
  DECISION_PROMPTS
} from '../data/case_2026_0825';

export type NavView =
  | 'landing'
  | 'briefing'
  | 'overview'
  | 'timeline'
  | 'evidence'
  | 'malware'
  | 'filesystem'
  | 'network'
  | 'endpoints'
  | 'identities'
  | 'challenges'
  | 'attack-chain'
  | 'report';

interface InvestigationContextType {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  caseStatus: string;
  elapsedSeconds: number;
  formatElapsedTime: () => string;
  score: number;
  accuracy: number;
  evidenceReviewedIds: Set<string>;
  timeline: TimelineEvent[];
  timelineFilter: EvidenceCategory;
  setTimelineFilter: (filter: EvidenceCategory) => void;
  evidenceItems: EvidenceItem[];
  selectedEvidence: EvidenceItem | null;
  setSelectedEvidence: (item: EvidenceItem | null) => void;
  markEvidenceReviewed: (id: string) => void;
  malware: MalwareAnalysis;
  filesystem: VirtualFile[];
  networkNodes: NetworkNode[];
  endpoints: Endpoint[];
  identities: Identity[];
  challenges: CTFChallenge[];
  submitFlag: (challengeId: string, flagInput: string) => { success: boolean; message: string };
  requestHint: (challengeId: string) => { hintText: string; level: number; penalty: number } | null;
  attackChain: AttackStage[];
  decisionPrompt: DecisionPrompt | null;
  makeDecision: (optionId: string) => void;
  aiMessages: AIMessage[];
  isAiAnalyzing: boolean;
  askAI: (query: string) => void;
  getAiHint: () => void;
  activeDecision: DecisionPrompt | null;
  completedCase: boolean;
  resetInvestigation: () => void;
  selectedFile: VirtualFile | null;
  setSelectedFile: (file: VirtualFile | null) => void;
  selectedNetworkNode: NetworkNode | null;
  setSelectedNetworkNode: (node: NetworkNode | null) => void;
  selectedEndpoint: Endpoint | null;
  setSelectedEndpoint: (ep: Endpoint | null) => void;
  selectedIdentity: Identity | null;
  setSelectedIdentity: (id: Identity | null) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<NavView>('landing');
  const [caseStatus, setCaseStatus] = useState<string>('ACTIVE');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(462); // starts at 07:42
  const [score, setScore] = useState<number>(740);
  const [evidenceReviewedIds, setEvidenceReviewedIds] = useState<Set<string>>(
    new Set(['EVIDENCE-017', 'AUTH-019'])
  );
  const [timelineFilter, setTimelineFilter] = useState<EvidenceCategory>('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  const [challenges, setChallenges] = useState<CTFChallenge[]>(CTF_CHALLENGES);
  const [attackChain, setAttackChain] = useState<AttackStage[]>(ATTACK_CHAIN_STAGES);
  const [activeDecision, setActiveDecision] = useState<DecisionPrompt | null>(DECISION_PROMPTS[0]);

  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(VIRTUAL_FILESYSTEM[2]);
  const [selectedNetworkNode, setSelectedNetworkNode] = useState<NetworkNode | null>(NETWORK_NODES[2]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(ENDPOINTS[0]);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(IDENTITIES[0]);

  const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState<number>(0);

  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'ANALYST',
      text: 'Incident INC-2026-0825 initialized. Abnormal authentication detected from internal workstation FINANCE-02. Recommended action: inspect timeline events starting at 09:42 UTC.',
      timestamp: '09:43:00',
      relevantEvidenceIds: ['EVIDENCE-017', 'AUTH-019'],
      recommendedNextStep: 'Review phishing attachment Payroll_Update.xlsm'
    }
  ]);

  // Real-time timer
  useEffect(() => {
    if (activeView === 'landing' || caseStatus === 'CONTAINED') return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeView, caseStatus]);

  const formatElapsedTime = (): string => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const markEvidenceReviewed = (id: string) => {
    setEvidenceReviewedIds((prev) => {
      const next = new Set(prev);
      if (!next.has(id)) {
        next.add(id);
        setScore((s) => s + 15); // +15 for reviewing evidence
      }
      return next;
    });
  };

  // Submit CTF flag
  const submitFlag = (challengeId: string, flagInput: string): { success: boolean; message: string } => {
    setTotalSubmissionsCount((c) => c + 1);
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return { success: false, message: 'Challenge not found.' };

    if (challenge.solved) {
      return { success: false, message: 'Challenge already completed.' };
    }

    const cleanInput = flagInput.trim();
    if (cleanInput.toLowerCase() === challenge.flag.toLowerCase()) {
      // Correct!
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, solved: true } : c))
      );
      setScore((s) => s + challenge.points);

      // Unlock attack chain stages progress
      unlockAttackChainStages();

      return {
        success: true,
        message: `FLAG ACCEPTED! +${challenge.points} Points. ${challenge.title} solved.`
      };
    } else {
      // Wrong answer penalty -20
      setWrongAnswersCount((w) => w + 1);
      setScore((s) => Math.max(0, s - 20));
      return {
        success: false,
        message: 'INCORRECT FLAG. Score penalty: -20 points.'
      };
    }
  };

  // Request CTF Hint
  const requestHint = (
    challengeId: string
  ): { hintText: string; level: number; penalty: number } | null => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return null;

    if (challenge.hintsUsedCount >= challenge.hints.length) {
      return {
        hintText: challenge.hints[challenge.hints.length - 1],
        level: challenge.hints.length,
        penalty: 0
      };
    }

    const currentHintIdx = challenge.hintsUsedCount;
    const hintText = challenge.hints[currentHintIdx];

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, hintsUsedCount: c.hintsUsedCount + 1 } : c
      )
    );

    // Hint penalty -25
    setScore((s) => Math.max(0, s - 25));

    return {
      hintText,
      level: currentHintIdx + 1,
      penalty: 25
    };
  };

  const unlockAttackChainStages = () => {
    setAttackChain((prev) => {
      const solvedCount = challenges.filter((c) => c.solved).length;
      return prev.map((stg, idx) => ({
        ...stg,
        unlocked: idx < Math.min(prev.length, 2 + solvedCount * 1.5)
      }));
    });
  };

  // Incident response decision
  const makeDecision = (optionId: string) => {
    if (!activeDecision) return;
    const opt = activeDecision.options.find((o) => o.id === optionId);
    if (!opt) return;

    setScore((s) => Math.max(0, s + opt.scoreDelta));
    setActiveDecision(null);

    if (opt.isCorrect) {
      setCaseStatus('CONTAINED');
      // Append AI message
      setAiMessages((msgs) => [
        ...msgs,
        {
          id: `msg-${Date.now()}`,
          sender: 'ANALYST',
          text: `CONTAINMENT VERIFIED: ${opt.feedback} Incident status updated to CONTAINED. Proceed to final report generation.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          relevantEvidenceIds: ['NET-012', 'AUTH-021']
        }
      ]);
    } else {
      setAiMessages((msgs) => [
        ...msgs,
        {
          id: `msg-${Date.now()}`,
          sender: 'ANALYST',
          text: `DECISION FEEDBACK: ${opt.feedback} Egress activity remains active. Re-evaluate containment strategy.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        }
      ]);
    }
  };

  // AI Analyst interaction
  const askAI = (query: string) => {
    const userMsg: AIMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiAnalyzing(true);

    setTimeout(() => {
      let replyText = '';
      let evidenceRefs: string[] = [];
      let recStep = '';

      const q = query.toLowerCase();

      if (q.includes('login') || q.includes('auth') || q.includes('suspicious')) {
        replyText =
          'The authentication at 09:47:03 UTC (AUTH-021) originated from IP 185.44.91.20 using account finance01. This IP is outside Northstar internal subnets (10.42.0.0/16). The user finance01 normally operates exclusively from 10.42.18.73. Furthermore, this logon occurred 3 minutes after macro payload execution on FINANCE-02.';
        evidenceRefs = ['AUTH-019', 'AUTH-021', 'EVIDENCE-017'];
        recStep = 'Compare source IP 185.44.91.20 against external C2 threat feeds.';
      } else if (q.includes('malware') || q.includes('excel') || q.includes('attachment')) {
        replyText =
          'Analysis of Payroll_Update.xlsm indicates a obfuscated Auto_Open macro. Upon opening, Excel spawned cmd.exe -> powershell.exe to download updater.exe from http://185.44.91.20/updater.exe into AppData\\Roaming.';
        evidenceRefs = ['EVIDENCE-017', 'ENDPOINT-REG-01'];
        recStep = 'Inspect the process tree in the Malware Simulation module.';
      } else if (q.includes('exfiltrat') || q.includes('archive') || q.includes('data')) {
        replyText =
          'At 09:57:22 UTC, staging archive FINANCE_EXPORT_2026.zip (482MB) was generated under Temp directory. At 10:01:13 UTC, network event NET-012 records 482MB exfiltrated via outbound HTTPS to 185.44.91.20:443.';
        evidenceRefs = ['FILE-021', 'NET-012'];
        recStep = 'Submit flag for Challenge 07 in the CTF panel.';
      } else if (q.includes('next') || q.includes('what should') || q.includes('guide')) {
        replyText =
          'Current priority: 1) Verify the exfiltrated archive in Filesystem explorer. 2) Submit the attacker IP flag in Challenges. 3) Execute host isolation decision for host FINANCE-02.';
        evidenceRefs = ['NET-008', 'FILE-021'];
        recStep = 'Open Challenge Board or Response Decision Modal.';
      } else {
        replyText = `Analysis of case INC-2026-0825 indicates a multi-stage compromise: Inbound spear-phishing (09:42 UTC) -> Macro execution -> Credential harvest -> External NTLM logon from 185.44.91.20 -> Lateral SMB access to FILE-01 -> Archive exfiltration.`;
        evidenceRefs = ['EVIDENCE-017', 'AUTH-021', 'NET-012'];
        recStep = 'Review complete timeline in Incident Timeline module.';
      }

      const aiMsg: AIMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ANALYST',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        relevantEvidenceIds: evidenceRefs,
        recommendedNextStep: recStep
      };

      setAiMessages((prev) => [...prev, aiMsg]);
      setIsAiAnalyzing(false);
    }, 1000);
  };

  const getAiHint = () => {
    askAI('Give me an investigation hint on what to look for next.');
  };

  // Accuracy calculation
  const accuracy = Math.min(
    100,
    Math.max(
      60,
      Math.round(
        100 -
          wrongAnswersCount * 8 -
          challenges.reduce((sum, c) => sum + c.hintsUsedCount * 4, 0)
      )
    )
  );

  const completedCase = caseStatus === 'CONTAINED' || challenges.every((c) => c.solved);

  const resetInvestigation = () => {
    setActiveView('landing');
    setCaseStatus('ACTIVE');
    setElapsedSeconds(462);
    setScore(740);
    setEvidenceReviewedIds(new Set(['EVIDENCE-017', 'AUTH-019']));
    setChallenges(CTF_CHALLENGES);
    setAttackChain(ATTACK_CHAIN_STAGES);
    setActiveDecision(DECISION_PROMPTS[0]);
    setWrongAnswersCount(0);
    setTotalSubmissionsCount(0);
  };

  return (
    <InvestigationContext.Provider
      value={{
        activeView,
        setActiveView,
        caseStatus,
        elapsedSeconds,
        formatElapsedTime,
        score,
        accuracy,
        evidenceReviewedIds,
        timeline: INITIAL_TIMELINE,
        timelineFilter,
        setTimelineFilter,
        evidenceItems: INITIAL_EVIDENCE,
        selectedEvidence,
        setSelectedEvidence,
        markEvidenceReviewed,
        malware: MALWARE_SAMPLE,
        filesystem: VIRTUAL_FILESYSTEM,
        networkNodes: NETWORK_NODES,
        endpoints: ENDPOINTS,
        identities: IDENTITIES,
        challenges,
        submitFlag,
        requestHint,
        attackChain,
        decisionPrompt: activeDecision,
        makeDecision,
        aiMessages,
        isAiAnalyzing,
        askAI,
        getAiHint,
        activeDecision,
        completedCase,
        resetInvestigation,
        selectedFile,
        setSelectedFile,
        selectedNetworkNode,
        setSelectedNetworkNode,
        selectedEndpoint,
        setSelectedEndpoint,
        selectedIdentity,
        setSelectedIdentity
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
