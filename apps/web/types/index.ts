export interface FieldDefinition {
  id: string;
  name: string;
  display_name: string;
  type: FieldType;
  required: boolean;
  multiple: boolean;
  placeholder?: string;
  default_value?: any;
  relation_to_id?: string;
  relation_to?: {
    id: string;
    name: string;
    slug: string;
  };
}

export type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "RICH_TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "EMAIL"
  | "URL"
  | "DATE"
  | "DATETIME"
  | "RELATION"
  | "MEDIA";
