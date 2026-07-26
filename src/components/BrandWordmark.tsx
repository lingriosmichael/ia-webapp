import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function BrandWordmark({
  to = "/",
  className,
  imageClassName,
  textClassName,
}: {
  to?: "/" | "/login" | "/register";
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}) {
  const { t } = useTranslation();
  const [imageUnavailable, setImageUnavailable] = useState(false);

  return (
    <Link
      to={to}
      className={cn("inline-flex items-center overflow-visible", className)}
    >
      {!imageUnavailable ? (
        <img
          src="/brindl-logo.png"
          alt={t("common.brand")}
          className={cn("block h-10 w-auto object-contain", imageClassName)}
          onError={() => setImageUnavailable(true)}
        />
      ) : (
        <span
          className={cn(
            "text-sm font-semibold tracking-[0.18em] text-primary",
            textClassName,
          )}
        >
          {t("common.brand")}
        </span>
      )}
    </Link>
  );
}
