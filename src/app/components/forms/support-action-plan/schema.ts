export type BlockType =
  | 'section_header'
  | 'paragraph'
  | 'list'
  | 'checkbox'
  | 'radio'
  | 'text'
  | 'date'
  | 'signature'
  | 'table_participant'
  | 'signature_group';

export interface SchemaBlock {
  type: BlockType;
  key?: string;
  label?: string;
  content?: string;
  items?: string[];
  meta?: Record<string, any>;
}

// Initial schema for Support Co-ordination Action Plan.
// This can be extended to fully match the legacy page1..page4 content.
export const supportActionPlanSchema: SchemaBlock[] = [
  // Note: Preferred Contact, Core Supports, Capacity Building, Capital sections are rendered
  // via custom renderers (preferred_contact, support_core, support_capacity, support_capital)
  // to match legacy layout. Only non-duplicate content from schema is listed here.
  
  // Goals section (rendered via custom renderer but keeping fields for reference)
  // Signature blocks (rendered via custom renderers)
  { type: 'signature_group', meta: { title: 'Participant / Representative', signatureKey: 'participantSignature', dateKey: 'participantDate', nameKey: 'participantName' } },
  { type: 'signature_group', meta: { title: 'Author', signatureKey: 'authorSignature', dateKey: 'authorDate', nameKey: 'authorName' } },
];



