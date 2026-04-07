export interface IApprover {
  key: string;
  name: string;
  email: string;
  isSelf?: boolean;
}

export interface IApproverPolicy {
  id: number;
  label: string;
  roleDescription: string;
  required: boolean;
}
