"use client";

import { Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { UrlFormData } from "@/lib/zod-schemas";

interface UrlFormProps {
  form: UseFormReturn<UrlFormData>;
  onSubmit: (data: UrlFormData) => void;
  isLoading: boolean;
}

export function UrlForm({ form, onSubmit, isLoading }: UrlFormProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldSet>
        <FieldGroup className="@container/field-group flex flex-col gap-6">
          {/* Long URL Field */}
          <Field>
            <FieldLabel htmlFor="originalUrl">Long URL</FieldLabel>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              disabled={isLoading}
              {...register("originalUrl")}
            />
            <FieldError>{errors.originalUrl?.message}</FieldError>
            <FieldDescription>
              Paste the full URL you want to shorten
            </FieldDescription>
          </Field>

          {/* Custom Code Field */}
          <Field>
            <FieldLabel htmlFor="customCode">
              Custom Short Code
              <span className="block text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id="customCode"
              placeholder="mycode123"
              minLength={6}
              maxLength={32}
              className="font-mono"
              disabled={isLoading}
              {...register("customCode")}
            />
            <FieldError>{errors.customCode?.message}</FieldError>
            <FieldDescription>
              Leave empty to auto-generate. Must be 6–32 alphanumeric
              characters.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <Loader size="sm" text="shortening..." />
        ) : (
          <>
            <Sparkles className="mr-2 size-5" />
            Shorten URL
          </>
        )}
      </Button>
    </form>
  );
}
