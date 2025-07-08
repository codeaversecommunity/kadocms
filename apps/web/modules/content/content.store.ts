import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createContent } from "./content.action";

type Type = {
  loading_form: boolean;

  form: {
    name: string;
    slug: string;

    field_definitions?: {
      name: string;
      display_name: string;
      type: string;
      required: boolean;
      multiple: boolean;
      placeholder: string;
      default_value?: string[];

      relation_to_id?: string;
    }[];
  };

  setForm: ({ key, value }: { key: keyof Type["form"]; value: any }) => void;
  setFieldDefinitions: (
    field_definitions: Type["form"]["field_definitions"]
  ) => void;
  handleAddField: () => void;
  handleRemoveField: (index: number) => void;

  report: any | null;

  // Actions
  create: () => Promise<boolean>;
  getReport: (id: string) => Promise<any>;
};

const defaultField = {
  name: "",
  display_name: "",
  type: "",
  required: true,
  multiple: false,
  placeholder: "E.g., Title of the content",
};

// --- Helper functions ---
const resetForm = () => ({
  name: "",
  slug: "",
  field_definitions: [{ ...defaultField }],
});

const mapFieldDefinitions = (
  field_definitions: Type["form"]["field_definitions"]
) =>
  field_definitions?.map((field) => ({
    ...defaultField,
    ...field,
  }));

// --- Zustand store ---
export const useContentStore = create<Type>()(
  persist(
    (set, get) => ({
      loading_form: false,
      form: resetForm(),
      report: null,

      setForm: ({ key, value }) => {
        set((state) => ({
          form: {
            ...state.form,
            [key]: value,
          },
        }));
      },

      setFieldDefinitions: (field_definitions) => {
        set((state) => ({
          form: {
            ...state.form,
            field_definitions: mapFieldDefinitions(field_definitions),
          },
        }));
      },

      handleAddField: () => {
        set((state) => ({
          form: {
            ...state.form,
            field_definitions: [
              ...(state.form.field_definitions ?? []),
              { ...defaultField },
            ],
          },
        }));
      },

      handleRemoveField: (index) => {
        set((state) => ({
          form: {
            ...state.form,
            field_definitions: state.form.field_definitions?.filter(
              (_, i) => i !== index
            ),
          },
        }));
      },

      // Actions
      create: async () => {
        set({ loading_form: true });
        try {
          const { form } = get();
          console.log("Creating content with form data:", form);

          const response = await createContent(form);

          toast.success("Content created successfully!");
          set({ form: resetForm() });

          return true;
        } catch (error: any) {
          toast.error(error.message || "Failed to create content");
          return false;
        } finally {
          set({ loading_form: false });
        }
      },

      getReport: async (id: string) => {
        try {
          const response = await fetch(`/contents/${id}`);
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.error || "Failed to fetch content");
          }

          console.log("Fetched report data:", data);

          set({ report: data.data });
        } catch (error: any) {
          toast.error(error.message || "Failed to fetch content");
          return null;
        }
      },
    }),
    {
      name: "content-store", // unique name for localStorage key
      partialize: (state) => ({
        form: state.form, // only persist the form data
      }),
    }
  )
);
