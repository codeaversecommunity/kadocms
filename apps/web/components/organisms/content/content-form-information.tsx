"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useContentStore } from "@/modules/content/content.store";

export default function ContentFormInformation({
  handleNext,
}: {
  handleNext?: () => void;
}) {
  const contentStore = useContentStore();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (handleNext) handleNext();
      }}
    >
      <div className="bg-muted/50 px-4 py-5 rounded-lg  sm:px-8 md:px-10">
        <h2 className="text-2xl">Enter Basic API Information</h2>

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
            onChange={(e) =>
              contentStore.setForm({ key: "name", value: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-5">
          <Label htmlFor="endpoint">Endpoint</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Enter API endpoint name. This can be changed later.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <p className="text-sm break-all">https://kadocms.com/api/v1/</p>
            <Input
              id="endpoint"
              placeholder="blogs"
              className="w-full sm:w-auto"
              value={contentStore.form.slug}
              onChange={(e) =>
                contentStore.setForm({ key: "slug", value: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <Button
          type="submit"
          disabled={!contentStore.form.name || !contentStore.form.slug}
        >
          Next
          <ArrowRight className="inline ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
