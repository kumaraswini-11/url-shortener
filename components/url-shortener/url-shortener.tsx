import { zodResolver } from "@hookform/resolvers/zod";
import { Link2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UrlFormData, urlShortenerFormSchema } from "@/lib/zod-schemas";
import { createShortUrl } from "@/lib/actions/create-short-url";

import { UrlForm } from "./url-form";
import { SuccessDialog } from "./success-dialog";

export function UrlShortener() {
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlShortenerFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);

    try {
      const result = await createShortUrl(data);
      const shortUrl = `${window.location.origin}/${result.code}`;
      setShortenedUrl(shortUrl);
      toast.success("URL shortened successfully!");
      form.reset();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Link2 className="w-8 h-8" />
            URL Shortener
          </CardTitle>
          <CardDescription>
            Paste a long URL and get a short one in seconds.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UrlForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <SuccessDialog
        shortenedUrl={shortenedUrl}
        onClose={() => setShortenedUrl(null)}
      />
    </>
  );
}
