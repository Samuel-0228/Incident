export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseStatus = 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
export type EvidenceCategory = 'ALL' | 'AUTH' | 'NETWORK' | 'FILES' | 'IDENTITY' | 'ENDPOINT' | 'EMAIL';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  category: EvidenceCategory;
  source: string;
  destination: string;
  description: string;
  evidenceId?: string;
  severity: Severity;
}

export interface EvidenceItem {
  id: string;
  type: 'EMAIL' | 'LOG' | 'FILE' | 'NETWORK CAPTURE' | 'CREDENTIAL EVENT' | 'ENDPOINT ARTIFACT';
  source: string;
  recipient?: string;
  timestamp: string;
  subject?: string;
  attachment?: string;
  status: 'SUSPICIOUS' | 'CONFIRMED MALICIOUS' | 'INSPECTED' | 'CLEAN';
  headers?: Record<string, string>;
  body?: string;
  details?: string;
  rawLog?: string;
  flag?: string;
  isUnlocked?: boolean;
}

export interface ProcessNode {
  pid: number;
  name: string;
  command: string;
  parentPid?: number;
  isSuspicious: boolean;
  explanation: string;
  children?: ProcessNode[];
}

export interface MalwareAnalysis {
  fileId: string;
  filename: string;
  fileType: string;
  size: string;
  hash: string;
  firstSeen: string;
  detectedBehavior: string[];
  processTree: ProcessNode;
}

export interface VirtualFile {
  path: string;
  name: string;
  type: 'file' | 'dir';
  size?: string;
  timestamp: string;
  isEncrypted?: boolean;
  content?: string;
  credentials?: { user: string; pass: string };
  flag?: string;
  isClue?: boolean;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'internet' | 'gateway' | 'workstation' | 'server' | 'database';
  ip: string;
  os: string;
  status: 'NORMAL' | 'SUSPICIOUS' | 'COMPROMISED';
  lastActivity: string;
  authEvents: number;
  connections: string[];
  description: string;
}

export interface Endpoint {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  user: string;
  status: 'COMPROMISED' | 'SUSPICIOUS' | 'NORMAL';
  lastSeen: string;
  openPorts: number[];
  compromiseVector?: string;
}

export interface Identity {
  username: string;
  role: string;
  lastLogin: string;
  normalIp: string;
  suspiciousIp?: string;
  failedLogins: number;
  privilegeLevel: 'USER' | 'FINANCE_ADMIN' | 'SYSTEM_ADMIN' | 'HELPDESK';
  systemsAccessed: string[];
  isCompromised: boolean;
  recentActivity: string;
}

export interface CTFChallenge {
  id: string;
  number: string;
  title: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  description: string;
  objective: string;
  availableEvidence: string[];
  flag: string;
  solved: boolean;
  hints: string[];
  hintsUsedCount: number;
  points: number;
}

export interface AttackStage {
  id: string;
  stageName: 'INITIAL ACCESS' | 'PHISHING' | 'CREDENTIAL THEFT' | 'ACCOUNT COMPROMISE' | 'LATERAL MOVEMENT' | 'PRIVILEGE ESCALATION' | 'DATA COLLECTION' | 'EXFILTRATION';
  unlocked: boolean;
  evidenceRef: string;
  description: string;
  timestamp: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  actionName: string;
  isCorrect: boolean;
  scoreDelta: number;
  feedback: string;
}

export interface DecisionPrompt {
  id: string;
  triggerEventId: string;
  title: string;
  description: string;
  options: DecisionOption[];
  resolvedOptionId?: string;
}

export interface AIMessage {
  id: string;
  sender: 'ANALYST' | 'USER';
  text: string;
  timestamp: string;
  relevantEvidenceIds?: string[];
  recommendedNextStep?: string;
  isStreaming?: boolean;
}
