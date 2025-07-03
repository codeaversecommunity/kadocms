export interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: "Active" | "Inactive" | "Suspended";
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    email: string;
    full_name?: string;
  };
  _count?: {
    members: number;
    object_types: number;
  };
}

export interface ObjectType {
  id: string;
  name: string;
  slug: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  field_definitions: FieldDefinition[];
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
  _count?: {
    entries: number;
  };
}

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

export interface Entry {
  id: string;
  object_type_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  object_type: {
    id: string;
    name: string;
    slug: string;
    workspace?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  creator?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface CreateWorkspaceData {
  name: string;
  slug: string;
  status?: string;
}

export interface CreateObjectTypeData {
  name: string;
  slug: string;
  workspace_id: string;
  field_definitions?: Omit<FieldDefinition, "id">[];
}

export interface CreateEntryData {
  object_type_id: string;
  data: Record<string, any>;
}
