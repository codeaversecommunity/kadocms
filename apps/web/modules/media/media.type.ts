import { SimpleUser } from "@/types";

export interface MediaFile {
  id: string;
  name: string;
  media_type: string; // e.g., "IMAGE"
  file_size?: number;
  file_path: string;
  width?: number;
  height?: number;
  alt_text?: string;
  description?: string;

  creator_id: string;
  creator?: SimpleUser;

  modifier_id?: string;
  modifier?: SimpleUser;

  workspace_id: string;
  //   workspace: TbmWorkspace;

  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
