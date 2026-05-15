export type Tab =
  | 'dashboard' | 'transactions' | 'add' | 'family' | 'invite'
  | 'invitations' | 'settings' | 'profile' | 'budget-history'
  | 'members' | 'states';

export interface Family {
  id: string;
  name: string;
  crest: string;
  motto: string;
  budget: number;
  maxBudget: number;
  members: number;
  founded: string;
}

export interface Member {
  id: string;
  name: string;
  role: 'parent' | 'child';
  color: string;
}

export const FAMILIES: Family[] = [
  {
    id: 'f1', name: 'SMITH GUILD', crest: '⚔',
    motto: 'STRENGTH THROUGH SAVINGS',
    budget: 7200, maxBudget: 10000, members: 4, founded: 'JAN 2024',
  },
  {
    id: 'f2', name: 'JOHNSON CLAN', crest: '🛡',
    motto: 'EVERY COIN COUNTS',
    budget: 3500, maxBudget: 8000, members: 3, founded: 'MAR 2025',
  },
];

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'John Smith',  role: 'parent', color: '#FFD700' },
  { id: 'm2', name: 'Jane Smith',  role: 'parent', color: '#BD93F9' },
  { id: 'm3', name: 'Mia Smith',   role: 'child',  color: '#39FF14' },
  { id: 'm4', name: 'Tom Smith',   role: 'child',  color: '#00D4FF' },
];

export const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard',      label: 'WORLD MAP',      icon: '🗺' },
  { id: 'transactions',   label: 'QUEST LOG',      icon: '📜' },
  { id: 'budget-history', label: 'HISTORY',        icon: '📊' },
  { id: 'add',            label: 'NEW QUEST',      icon: '✚' },
  { id: 'family',         label: 'GUILD HALL',     icon: '⚔' },
  { id: 'members',        label: 'PARTY MEMBERS',  icon: '👥' },
  { id: 'invitations',    label: 'INVITATIONS',    icon: '✉' },
  { id: 'invite',         label: 'INVITE MEMBER',  icon: '📨' },
  { id: 'settings',       label: 'GUILD SETTINGS', icon: '⚙' },
  { id: 'profile',        label: 'CHARACTER',      icon: '👤' },
  { id: 'states',         label: 'SYS STATES',     icon: '🔧' },
];

export const TITLES: Record<Tab, string> = {
  'dashboard':      'WORLD MAP — HQ',
  'transactions':   'QUEST LOG',
  'add':            'LOG NEW QUEST',
  'family':         'GUILD HALL',
  'invite':         'SEND PARTY INVITE',
  'invitations':    'INVITATIONS',
  'settings':       'GUILD SETTINGS',
  'profile':        'CHARACTER SHEET',
  'budget-history': 'TREASURY HISTORY',
  'members':        'PARTY MEMBERS',
  'states':         'SYSTEM STATES',
};