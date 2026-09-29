"use client";

import Link from "next/link";
import css from "./Button.module.css";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  ariaLabel?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

interface ButtonProps extends BaseProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const AppLink = ({
  children,
  href,
  className,
  variant = "primary",
  target,
  rel,
  disabled = false,
  onClick,
  ariaLabel,
}: LinkProps) => {
  const rootClassName = `
    ${css.btn}
    ${css[variant]}
    ${disabled ? css.disabled : ""}
    ${className || ""}
  `.trim();

  return (
    <Link
      href={disabled ? "" : href}
      className={rootClassName}
      target={target}
      rel={rel}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
        onClick?.();
      }}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

export const AppButton = ({
  children,
  onClick,
  className,
  variant = "primary",
  type = "button",
  disabled = false,
  ariaLabel,
}: ButtonProps) => {
  const rootClassName = `${css.btn} ${css[variant]} ${className || ""}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={rootClassName}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
