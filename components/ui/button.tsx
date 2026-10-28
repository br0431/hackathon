import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import * as React from "react";

/**
 * Botón de marca: píldora, borde de tinta y sombra dura (docs/DESIGN.md §1).
 * Al pasar el ratón se desplaza y la sombra se reduce; al pulsar, se hunde.
 * Altura mínima de 44 px (CLAUDE.md, accesibilidad).
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink font-bold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-150 ease-out outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-violet text-white shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none",
        secondary:
          "bg-white text-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none",
        sun: "bg-sun text-ink shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none",
        destructive:
          "bg-destructive text-white shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none",
        ghost: "border-transparent bg-transparent text-ink hover:border-ink hover:bg-white",
        link: "border-transparent text-violet underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-5 text-base",
        sm: "min-h-11 px-4 text-sm",
        lg: "min-h-14 px-7 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
