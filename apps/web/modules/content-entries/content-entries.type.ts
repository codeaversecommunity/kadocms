export type ContentEntry = {
  id: string;
  content_id: string;
  data: {
    title: string;
    slug: string;
    content: string;
    published: boolean;
  };
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_deleted: boolean;
  creator_id: string;
  modifier_id: string | null;
  content: {
    id: string;
    name: string;
    slug: string;
    workspace: {
      id: string;
      name: string;
      slug: string;
    };
  };
  creator: {
    id: string;
    email: string;
    full_name: string;
    username: string;
  };
};
