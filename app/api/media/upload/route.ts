import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string;
    const description = formData.get("description") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    // Verify user has access to workspace
    const workspaceMember = await prisma.tbs_workspace_member.findFirst({
      where: {
        workspace_id: workspaceId,
        user_id: user.id,
        status: "Active",
        is_deleted: false,
      },
    });

    if (!workspaceMember) {
      return NextResponse.json({ error: "Access denied to workspace" }, { status: 403 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(buffer, {
      folder: `kadocms/${workspaceId}`,
      resource_type: "auto",
    });

    // Save to database
    const mediaFile = await prisma.tbm_media.create({
      data: {
        name: file.name,
        media_type: file.type,
        file_size: file.size,
        file_path: cloudinaryResult.secure_url,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        alt_text: altText || null,
        description: description || null,
        creator_id: user.id,
        workspace_id: workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      file: mediaFile,
      cloudinary: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}