import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

const Card = ({ children, padded = true, className = "", ...rest }: CardProps) => (
  <div
    className={[
      "surface-card",
      padded ? "p-6 sm:p-8" : "",
      className,
    ].join(" ")}
    {...rest}
  >
    {children}
  </div>
);

export default Card;