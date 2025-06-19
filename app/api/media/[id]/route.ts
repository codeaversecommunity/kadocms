import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { alt_text, description } = await request.json();
    const fileId = params.id;

    // Verify user has access to this file
    const mediaFile = await prisma.tbm_media.findFirst({
      where: {
        id: fileId,
        is_deleted: false,
        workspace: {
          members: {
            some: {
              user_id: user.id,
              status: "Active",
              is_deleted: false,
            },
          },
        },
      },
    });

    if (!mediaFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Update the file
    const updatedFile = await prisma.tbm_media.update({
      where: { id: fileId },
      data: {
        alt_text,
        description,
        modifier_id: user.id,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileId = params.id;

    // Verify user has access to this file
    const mediaFile = await prisma.tbm_media.findFirst({
      where: {
        id: fileId,
        is_deleted: false,
        workspace: {
          members: {
            some: {
              user_id: user.id,
              status: "Active",
              is_deleted: false,
            },
          },
        },
      },
    });

    if (!mediaFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Extract public_id from Cloudinary URL
    const urlParts = mediaFile.file_path.split('/');
    const publicIdWithExtension = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExtension.split('.')[0]; // Remove extension

    try {
      // Delete from Cloudinary
      await deleteFromCloudinary(publicId);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Soft delete from database
    await prisma.tbm_media.update({
      where: { id: fileId },
      data: {
        is_deleted: true,
        modifier_id: user.id,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}