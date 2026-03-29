"use client";
import ErrorFallback from "@/components/layouts/ErrorFallback";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} />;
}
