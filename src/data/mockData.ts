import { IApprover, IApproverPolicy } from '../types/models';

export const CURRENT_USER: IApprover = {
  key: 'alexmorgan',
  name: 'Alex Morgan',
  email: 'alexmorgan@microsoft.com',
  isSelf: true,
};

export const EMPOWERED_APPROVERS: IApprover[] = [
  CURRENT_USER,
  { key: 'jonahklein', name: 'Jonah Klein', email: 'jonahk@microsoft.com' },
  { key: 'joannasmith', name: 'Joanna Smith', email: 'joannas@microsoft.com' },
  { key: 'josephinetaylor', name: 'Josephine Taylor', email: 'josephinet@microsoft.com' },
  { key: 'jordanlopez', name: 'Jordan Lopez', email: 'jordanl@microsoft.com' },
];

export const APPROVERS: IApprover[] = [
  CURRENT_USER,
  { key: 'jonahklein', name: 'Jonah Klein', email: 'jonahk@microsoft.com' },
  { key: 'joannasmith', name: 'Joanna Smith', email: 'joannas@microsoft.com' },
  { key: 'josephinetaylor', name: 'Josephine Taylor', email: 'josephinet@microsoft.com' },
  { key: 'jordanlopez', name: 'Jordan Lopez', email: 'jordanl@microsoft.com' },
  { key: 'michaelchen', name: 'Michael Chen', email: 'michaelchen@microsoft.com' },
  { key: 'emilywilliams', name: 'Emily Williams', email: 'emilywilliams@microsoft.com' },
  { key: 'albertmuller', name: 'Albert Muller', email: 'albertm@microsoft.com' },
  { key: 'jessicatan', name: 'Jessica Tan', email: 'jessicat@microsoft.com' },
  { key: 'rahulsingh', name: 'Rahul Singh', email: 'rahuls@microsoft.com' },
  { key: 'sarahconnor', name: 'Sarah Connor', email: 'sarahc@microsoft.com' },
  { key: 'davidpark', name: 'David Park', email: 'davidp@microsoft.com' },
  { key: 'lisawang', name: 'Lisa Wang', email: 'lisaw@microsoft.com' },
  { key: 'jamesrodriguez', name: 'James Rodriguez', email: 'jamesr@microsoft.com' },
  { key: 'priyapatel', name: 'Priya Patel', email: 'priyap@microsoft.com' },
  { key: 'tomhanks', name: 'Tom Hanks', email: 'tomh@microsoft.com' },
  { key: 'nataliekim', name: 'Natalie Kim', email: 'nataliek@microsoft.com' },
  { key: 'robertjohnson', name: 'Robert Johnson', email: 'robertj@microsoft.com' },
  { key: 'amandagreer', name: 'Amanda Greer', email: 'amandag@microsoft.com' },
  { key: 'chrisevans', name: 'Chris Evans', email: 'chrise@microsoft.com' },
];

export const APPROVER_POLICY: IApproverPolicy = {
  id: 1,
  label: 'FieldSales approver',
  roleDescription: 'BD-Regional Director/GM',
  required: true,
};

export const APPROVAL_SEQUENCE: IApproverPolicy[] = [
  { id: 1, label: 'FieldSales approver', roleDescription: 'BD-Regional Director/GM', required: true },
  { id: 2, label: 'ACO Approver', roleDescription: '', required: true },
  { id: 3, label: 'MACC Approver', roleDescription: '', required: true },
];
