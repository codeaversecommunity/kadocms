import { Separator } from "@/components/atoms/separator";
import { getContent } from "@/modules/content/content.action";
import { Button } from "@/components/atoms/button";
import { Send, Settings } from "lucide-react";

import Link from "next/link";
import { getProfile } from "@/modules/user/user.action";

export default async function ContentApiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const content = await getContent(slug);
  const profile = await getProfile();

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

        <div className="flex gap-3">
          <Link
            href={`${apiUrl}/api/${profile?.workspace?.slug}/${content?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="link" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Preview API
            </Button>
          </Link>
          <Link href={`/dashboard/apis/${content?.slug}/settings`}>
            <Button variant="link" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Separator />
      {children}
    </>
  );
}
