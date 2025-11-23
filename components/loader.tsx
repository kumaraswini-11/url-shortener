import { cn } from "@/lib/utils";

export const Spinner = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <svg
    className={cn("animate-spin text-primary", {
      "size-5": size === "md",
      "size-4": size === "sm",
    })}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    aria-label="Loading"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Loader = ({
  size = "sm",
  text = "Loading ...",
  className,
}: {
  size?: "sm" | "md";
  text?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Spinner size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};
