"use client";

import { toast } from "sonner";
import { create } from "zustand";
import {
  getMedia,
  uploadMediaFile,
  updateMedia,
  deleteMedia,
} from "@/modules/media/media.action";
import { pagination } from "@/types/api";
import {
  type Media,
  type MediaQueryParams,
  type CreateMediaData,
  type UpdateMediaData,
} from "./media.type";

type Type = {
  loading_reports: boolean;
  loading_update: boolean;
  loading_delete: boolean;
  loading_upload: boolean;

  reports: Media[];
  pagination: pagination;

  report: Media | null;

  // Query parameters
  queryParams: MediaQueryParams;

  getReports: (params?: Partial<MediaQueryParams>) => Promise<void>;
  setReport: (report: Media | null) => void;
  setQueryParams: (params: Partial<MediaQueryParams>) => void;

  upload: (
    file: File,
    data?: Partial<CreateMediaData>
  ) => Promise<Media | null>;
  update: (fileId: string, data: Partial<UpdateMediaData>) => Promise<void>;
  delete: (fileId: string) => Promise<void>;

  // Helper methods
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setMediaType: (mediaType?: "IMAGE" | "VIDEO" | "DOCUMENT" | "FILE") => void;
  refreshReports: () => Promise<void>;
};

export const useMediaStore = create<Type>((set, get) => ({
  loading_reports: false,
  loading_update: false,
  loading_delete: false,
  loading_upload: false,

  reports: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  report: null,

  queryParams: {
    page: 1,
    limit: 12,
    sortBy: "created_at",
    sortOrder: "desc",
  },

  getReports: async (params) => {
    set({ loading_reports: true });
    try {
      const currentParams = get().queryParams;
      const finalParams = {
        ...currentParams,
        ...params,
      };

      const response = await getMedia(finalParams);
      console.log("Media response:", response);

      set({
        reports: response.data,
        pagination: response.meta,
        queryParams: finalParams,
      });
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      //   toast.error("Failed to load media files");
    } finally {
      set({ loading_reports: false });
    }
  },

  setReport: (report) => {
    set({ report });
  },

  setQueryParams: (params) => {
    set((state) => ({
      queryParams: { ...state.queryParams, ...params },
    }));
  },

  upload: async (file, data = {}) => {
    set({ loading_upload: true });
    try {
      const uploadData: CreateMediaData = {
        name: data.name || file.name,
        ...data,
      };

      const response: any = await uploadMediaFile(file, uploadData);

      if (response.success) {
        toast.success("File uploaded successfully");

        // Refresh the reports list
        await get().getReports({ page: 1 });

        return response.data;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      set({ loading_upload: false });
    }
  },

  update: async (fileId, data) => {
    set({ loading_update: true });
    try {
      const response: any = await updateMedia(fileId, data);

      if (response.success) {
        // Update the reports list
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === fileId ? { ...report, ...response.data } : report
          ),
        }));

        // Update the current report if it's the same one
        const currentReport = get().report;
        if (currentReport && currentReport.id === fileId) {
          set({ report: { ...currentReport, ...response.data } });
        }

        toast.success("Media updated successfully");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Failed to update media:", error);
      toast.error("Failed to update media");
    } finally {
      set({ loading_update: false });
    }
  },

  delete: async (fileId) => {
    set({ loading_delete: true });
    try {
      const response: any = await deleteMedia(fileId);

      if (response.success) {
        // Remove from reports list
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== fileId),
        }));

        // Clear current report if it's the deleted one
        const currentReport = get().report;
        if (currentReport && currentReport.id === fileId) {
          set({ report: null });
        }

        toast.success("Media deleted successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete media:", error);
      toast.error("Failed to delete media");
    } finally {
      set({ loading_delete: false });
    }
  },

  // Helper methods
  setPage: (page) => {
    get().getReports({ page });
  },

  setSearch: (search) => {
    get().getReports({ search, page: 1 });
  },

  setMediaType: (media_type) => {
    get().getReports({ media_type, page: 1 });
  },

  refreshReports: async () => {
    const { queryParams } = get();
    await get().getReports(queryParams);
  },
}));
