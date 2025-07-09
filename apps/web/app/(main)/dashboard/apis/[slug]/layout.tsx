import { Separator } from "@/components/atoms/separator";
import { getContent } from "@/modules/content/content.action";
import { Button } from "@/components/atoms/button";
import { Settings } from "lucide-react";

import Link from "next/link";

export default async function ContentApiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent(slug);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Link
            className="text-xl font-medium"
            href={`/dashboard/apis/${content?.slug}`}
          >
            {content?.name || "Content"}
          </Link>

          <p className="text-sm text-muted-foreground">
            Manage your content files and data for {content?.name || "Content"}.
          </p>
        </div>

        <Link href={`/dashboard/apis/${content?.slug}/settings`}>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      <Separator />
      {children}
    </>
  );
}
