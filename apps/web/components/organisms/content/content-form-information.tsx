"use client";

import { ArrowRight, Check, XCircle } from "lucide-react";
import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useContentStore } from "@/modules/content/content.store";
import { validateSlugContent } from "@/modules/content/content.action";
import { Separator } from "@/components/atoms/separator";
import { Card, CardContent } from "@/components/atoms/card";
import { formatSlug } from "@/lib/utils";

export default function ContentFormInformation({
  handleNext,
}: {
  handleNext?: () => void;
}) {
  const contentStore = useContentStore();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingSlug, setLoadingSlug] = useState(false);
  const [isValidSlug, setIsValidSlug] = useState<null | boolean>(null);

  // Debounced slug validation
  const debouncedValidateSlug = useCallback(
    (slug: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setLoadingSlug(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const validate = await validateSlugContent(slug);
          setIsValidSlug(!validate.exists);
        } catch (err) {
          setIsValidSlug(null);
        } finally {
          setLoadingSlug(false);
        }
      }, 400);
    },
    [debounceRef]
  );

  // Slug input change handler
  const handleSlugChange = (value: string) => {
    const slug = formatSlug(value);

    contentStore.setForm({ key: "slug", value: value });
    if (slug) debouncedValidateSlug(slug);
  };

  // Name input change handler
  const handleNameChange = (value: string) => {
    contentStore.setForm({ key: "name", value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (handleNext) handleNext();
      }}
    >
      <Card>
        <CardContent>
          <div className="">
            <h2 className="text-lg font-medium">Enter Basic API Information</h2>

            <br />
            <div className="mb-5">
              <Label htmlFor="api-name">API Name</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Enter description of API. This can be changed later.
              </p>
              <Input
                id="api-name"
                placeholder="E.g., Blogs, Products, etc."
                className="w-full"
                value={contentStore.form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="mb-5">
              <Label htmlFor="endpoint">Endpoint</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Enter API endpoint name. This can be changed later.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-2">
                <p className="text-sm break-all py-2">
                  https://kadocms.com/api/v1/
                </p>
                <div>
                  <div className="relative w-full sm:w-auto flex items-center gap-2">
                    <Input
                      id="endpoint"
                      placeholder="blogs"
                      className="w-full sm:w-auto"
                      value={contentStore.form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                    />

                    <span className="text-nowrap">
                      {loadingSlug && (
                        <span className="flex gap-1 text-xs text-muted-foreground animate-pulse">
                          Validating...
                        </span>
                      )}

                      {!loadingSlug && isValidSlug === true && (
                        <span className="flex gap-1 text-xs text-green-500">
                          <Check className="inline h-4 w-4" />
                          Slug is available
                        </span>
                      )}

                      {!loadingSlug && isValidSlug === false && (
                        <span className="flex gap-1 text-xs text-red-500 animate-shake transition-all">
                          <XCircle className="inline h-4 w-4" />
                          Slug is not available
                        </span>
                      )}
                    </span>
                  </div>

                  {/* message to show slug will be */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {/* Slug will be{" "}
                    <strong>{formatSlug(contentStore.form.slug)}</strong>. */}
                    Slug will be{" "}
                    <strong>{formatSlug(contentStore.form.slug)}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-5">
        <Button
          type="submit"
          disabled={
            !contentStore.form.name ||
            !contentStore.form.slug ||
            isValidSlug === false
          }
        >
          Next
          <ArrowRight className="inline ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
