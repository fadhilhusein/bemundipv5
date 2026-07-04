import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
};

const variants = {
  primary: "bg-orange text-white shadow-card hover:bg-red",
  secondary: "border-2 border-brown/75 text-brown hover:bg-brown hover:text-white",
  dark: "bg-brown text-white hover:bg-[#201109]"
};

export function Button({
  children,
  href,
  variant = "primary",
  className = ""
}: ButtonProps) {
  const classes = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-[250ms] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
