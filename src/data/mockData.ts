import { IApprover, IApproverPolicy } from '../types/models';

export const CURRENT_USER: IApprover = {
  key: 'alexmorgan',
  name: 'Alex Morgan',
  email: 'alexmorgan@microsoft.com',
  isSelf: true,
};

export const APPROVERS: IApprover[] = [
  CURRENT_USER,
  { key: 'johndoe', name: 'John Doe', email: 'johndoe@microsoft.com' },
  { key: 'sarahjohnson', name: 'Sarah Johnson', email: 'sarahjohnson@microsoft.com' },
  { key: 'michaelchen', name: 'Michael Chen', email: 'michaelchen@microsoft.com' },
  { key: 'emilywilliams', name: 'Emily Williams', email: 'emilywilliams@microsoft.com' },
  { key: 'albertmuller', name: 'Albert Muller', email: 'albertm@microsoft.com' },
  { key: 'jessicatan', name: 'Jessica Tan', email: 'jessicat@microsoft.com' },
  { key: 'rahulsingh', name: 'Rahul Singh', email: 'rahuls@microsoft.com' },
  { key: 'mariagomez', name: 'Maria Gomez', email: 'mariag@microsoft.com' },
  { key: 'kofimensah', name: 'Kofi Mensah', email: 'kofim@microsoft.com' },
];

export const APPROVER_POLICY: IApproverPolicy = {
  id: 1,
  label: 'FieldSales approver',
  roleDescription: 'BD-Regional Director/GM',
  required: true,
};
