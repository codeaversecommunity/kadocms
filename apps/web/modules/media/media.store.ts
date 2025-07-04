import { toast } from "sonner";
import { create } from "zustand";
import { MediaFile } from "./media.type";
import { pagination } from "@/types/api";
import { $api } from "@/lib/api";

type Type = {
  loading_reports: boolean;
  loading_update: boolean;
  loading_delete: boolean;

  reports: MediaFile[];
  pagination: pagination;

  report: MediaFile | null;

  getReports: () => Promise<void>;
  setReport: (report: MediaFile | null) => void;

  update: (fileId: string, data: Partial<MediaFile>) => Promise<void>;
  delete: (fileId: string) => Promise<void>;
};

export const useMediaStore = create<Type>((set, get) => ({
  loading_reports: false,
  loading_update: false,
  loading_delete: false,

  reports: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  report: null,

  getReports: async () => {
    set({ loading_reports: true });
    try {
      const response = await $api("/api/media");

      set({
        reports: response?.data,
        pagination: response?.pagination,
      });
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      set({ loading_reports: false });
    }
  },

  setReport: (report) => set({ report: report || null }),

  update: async (fileId, data) => {
    set({ loading_update: true });
    try {
      const { getReports } = get();
      await toast.promise(
        $api(`/api/media/${fileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then(async (res) => {
          if (!res.ok) throw new Error("Failed to update file");
          await getReports();
        }),
        {
          loading: "Updating file...",
          success: "File updated successfully",
          error: "Failed to update file",
        }
      );
    } catch (error) {
      console.error("Error updating file:", error);
    } finally {
      set({ loading_update: false });
    }
  },

  delete: async (fileId) => {
    set({ loading_delete: true });
    try {
      const { getReports } = get();
      await toast.promise(
        $api(`/api/media/${fileId}`, {
          method: "DELETE",
        }).then(async (res) => {
          if (!res.ok) throw new Error("Failed to delete file");
          await getReports();
        }),
        {
          loading: "Deleting file...",
          success: "File deleted successfully",
          error: "Failed to delete file",
        }
      );

      set({ report: null }); // Clear the current report after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      set({ loading_delete: false });
    }
  },
}));
