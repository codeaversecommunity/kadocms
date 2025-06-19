import { createClient } from "@/utils/supabase/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get or create user in our database
  let dbUser = await prisma.tbm_user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    // Extract username from email or use full name
    const username = user.user_metadata?.preferred_username || 
                    user.user_metadata?.user_name || 
                    user.email!.split('@')[0];

    dbUser = await prisma.tbm_user.create({
      data: {
        email: user.email!,
        username: username,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar: user.user_metadata?.avatar_url || null,
        email_verified: user.email_confirmed_at ? true : false,
      },
    });

    // Create default workspace for new user
    await createDefaultWorkspace(dbUser.id, username);
  }

  return dbUser;
}

export async function createDefaultWorkspace(userId: string, username: string) {
  const workspaceName = `${username}'s Org`;
  const workspaceSlug = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}-org`;

  const workspace = await prisma.tbm_workspace.create({
    data: {
      name: workspaceName,
      slug: workspaceSlug,
      creator_id: userId,
    },
  });

  // Add creator as owner
  await prisma.tbs_workspace_member.create({
    data: {
      workspace_id: workspace.id,
      user_id: userId,
      role: "Owner",
    },
  });

  return workspace;
}

export async function getUserWorkspaces(userId: string) {
  return await prisma.tbs_workspace_member.findMany({
    where: {
      user_id: userId,
      status: "Active",
      is_deleted: false,
    },
    include: {
      workspace: true,
    },
  });
}

export async function createWorkspace(
  name: string,
  slug: string,
  creatorId: string
) {
  const workspace = await prisma.tbm_workspace.create({
    data: {
      name,
      slug,
      creator_id: creatorId,
    },
  });

  // Add creator as owner
  await prisma.tbs_workspace_member.create({
    data: {
      workspace_id: workspace.id,
      user_id: creatorId,
      role: "Owner",
    },
  });

  return workspace;
}

export async function getWorkspaceById(workspaceId: string) {
  return await prisma.tbm_workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}