import {
  Braces,
  Brackets,
  Calendar,
  Image,
  Images,
  List,
  ListTodo,
  Pilcrow,
  ToggleLeft,
  Type,
} from "lucide-react";

export const fieldTypes = [
  {
    name: "Text Field",
    value: "TEXT_FIELD",
    description: "One line of input text which is suitable for short text.",
    icon: Type,
  },
  {
    name: "Text Area",
    value: "TEXT_AREA",
    description: "Multi-line input text which is suitable for longer text.",
    icon: List,
  },
  {
    name: "Rich Text Editor",
    value: "RICH_TEXT_EDITOR",
    description: "WYSIWYG editor for rich text content.",
    icon: Pilcrow,
  },
  {
    name: "Image",
    value: "IMAGE",
    description: "Single image upload field.",
    icon: Image,
  },
  {
    name: "Multiple Images",
    value: "MULTIPLE_IMAGES",
    description: "Upload multiple images.",
    icon: Images,
  },
  {
    name: "Date",
    value: "DATE",
    description: "Date picker for selecting a date.",
    icon: Calendar,
  },
  {
    name: "Boolean",
    value: "BOOLEAN",
    description: "True/false toggle switch.",
    icon: ToggleLeft,
  },
  {
    name: "Selectable Field",
    value: "SELECTABLE_FIELD",
    description: "Dropdown or radio button selection from predefined options.",
    icon: ListTodo,
  },
  {
    name: "Content Reference",
    value: "CONTENT_REFERENCE",
    description:
      "Reference to another content type, allowing linking between content.",
    icon: Braces,
  },
  {
    name: "Multiple Content References",
    value: "MULTIPLE_CONTENT_REFERENCE",
    description:
      "Reference to multiple entries of another content type, allowing linking between content.",
    icon: Brackets,
  },
];
