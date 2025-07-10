export interface Content {
  id: string;
  name: string;
  slug: string;
  workspace_id: string;
  creator_id: string;
  modifier_id: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  field_definitions: FieldDefinition[];
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  entries: any[];
}

export interface FieldDefinition {
  id: string;
  name: string;
  display_name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  placeholder: null;
  default_value: null;
  content_id: string;
  relation_to_content_id: null;
  creator_id: string;
  modifier_id: null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  relation_to_content: null;
}
