"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Loader } from "./loader";
import { CopyButton } from "./copy-button";
import { UrlFormData, urlShortenerFormSchema } from "@/lib/zod-schemas";

export function UrlShortener() {
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlShortenerFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UrlFormData) => {
    console.log("Submitting data:", data);
    setIsLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) {
        console.error("Error shortening URL:", result);
        toast.error(result.error || "Failed to shorten URL");
      } else {
        // The API returns the inserted link object
        const shortUrl = `${window.location.origin}/${result.code}`;
        setShortenedUrl(shortUrl);
        toast.success("URL shortened successfully!");
        reset(); // Reset the form
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Link2 className="w-8 h-8" />
            URL Shortener
          </CardTitle>
          <CardDescription>
            Paste a long URL and get a short one in seconds
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Group fields semantically */}
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
        </CardContent>
      </Card>

      {/* Dialog for post-success feedback */}
      <Dialog open={!!shortenedUrl} onOpenChange={() => setShortenedUrl(null)}>
        <DialogContent>
          <DialogTitle className="text-xl">Your URL is ready!</DialogTitle>
          <DialogDescription>
            Here is your shortened URL. You can copy it and share anywhere. For
            analytics and more features, visit the details page.
          </DialogDescription>
          <div className="flex items-center gap-2 my-4">
            <span className="font-mono bg-accent p-2 rounded select-all">
              {shortenedUrl}
            </span>
            <CopyButton text={shortenedUrl ?? ""} />
          </div>
          <p className="text-sm text-muted-foreground">
            For more details or analytics,{" "}
            <a href={shortenedUrl ?? "#"} className="underline">
              visit the respective link page
            </a>
            .
          </p>
          <DialogFooter>
            <Button onClick={() => setShortenedUrl(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
