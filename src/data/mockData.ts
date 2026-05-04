import { IApprover, IApproverPolicy } from '../types/models';

export const CURRENT_USER: IApprover = {
  key: 'alexmorgan',
  name: 'Alex Morgan',
  email: 'alexmorgan@microsoft.com',
  isSelf: true,
};

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
