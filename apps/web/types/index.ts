export interface SimpleUser {
  id: string;
  email: string;
  full_name: string;
  username: string;
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
