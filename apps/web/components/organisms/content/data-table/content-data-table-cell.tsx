import { Badge } from "@/components/atoms/badge";
import Image from "next/image";

export const ContentDataTableCell = ({
  field,
  value,
}: {
  field?: any;
  value?: any;
}) => {
  if (!value && value !== false && value !== 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  switch (field.type) {
    case "TEXT_FIELD":
      return (
        <span className="max-w-[200px] truncate block" title={value}>
          {value}
        </span>
      );

    case "TEXT_AREA":
      const truncatedText =
        String(value).length > 100
          ? String(value).substring(0, 100) + "..."
          : value;
      return (
        <span className="max-w-[250px] block" title={value}>
          {truncatedText}
        </span>
      );

    case "RICH_TEXT_EDITOR":
      // Strip HTML tags for table display
      const textContent = String(value).replace(/<[^>]*>/g, "");
      const truncatedRichText =
        textContent.length > 100
          ? textContent.substring(0, 100) + "..."
          : textContent;
      return (
        <span className="max-w-[250px] block" title={textContent}>
          {truncatedRichText}
        </span>
      );

    case "IMAGE":
      return (
        <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={value}
            alt={field.display_name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML =
                '<span class="text-xs text-muted-foreground">No Image</span>';
            }}
          />
        </div>
      );

    case "MULTIPLE_IMAGES":
      const images = Array.isArray(value) ? value : [];
      return (
        <div className="flex gap-1">
          {images.slice(0, 3).map((img: string, idx: number) => (
            <div key={idx} className="w-8 h-8 rounded overflow-hidden bg-muted">
              <Image
                src={img}
                alt={`${field.display_name} ${idx + 1}`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {images.length > 3 && (
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
              <span className="text-xs">+{images.length - 3}</span>
            </div>
          )}
        </div>
      );

    case "DATE":
      return (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      );

    case "BOOLEAN":
      return (
        <Badge variant={value ? "default" : "secondary"} className="text-xs">
          {value ? "Yes" : "No"}
        </Badge>
      );

    case "SELECTABLE_FIELD":
      return (
        <Badge variant="outline" className="text-xs max-w-[150px] truncate">
          {value}
        </Badge>
      );

    case "CONTENT_REFERENCE":
      return (
        <span className="text-sm text-blue-600 max-w-[150px] truncate block">
          {value?.title || value?.name || "Referenced Content"}
        </span>
      );

    case "MULTIPLE_CONTENT_REFERENCE":
      const references = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-1">
          {references.slice(0, 2).map((ref: any, idx: number) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {ref?.title || ref?.name || `Ref ${idx + 1}`}
            </Badge>
          ))}
          {references.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{references.length - 2}
            </Badge>
          )}
        </div>
      );

    default:
      return (
        <span className="max-w-[200px] truncate block" title={String(value)}>
          {String(value)}
        </span>
      );
  }
};
