export type IRABlockType =
  | 'title'
  | 'header_grid'
  | 'risk_matrix'
  | 'risk_table'
  | 'additional_info'
  | 'review_and_signature';

export interface IRABlock {
  type: IRABlockType;
  label?: string;
}

// Ordered blocks for Individual Activity Risk Assessment view/pdf
export const iraSchema: IRABlock[] = [
  { type: 'title', label: 'Individual Activity Risk Assessment' },
  { type: 'header_grid' },
  { type: 'risk_matrix' },
  { type: 'risk_table', label: 'POTENTIAL RISK & CONTROL MEASURES' },
  { type: 'additional_info', label: 'Additional Support Requirements' },
  { type: 'review_and_signature' },
];



