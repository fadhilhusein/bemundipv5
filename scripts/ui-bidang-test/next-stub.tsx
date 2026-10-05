import React from "react";

// Only Next routing/image optimization is stubbed. The real CRUD component runs.
export default function NextStub(props: Record<string, unknown>) {
  const { children, priority, ...rest } = props;
  void priority;
  return props.href
    ? <a {...rest}>{children as React.ReactNode}</a>
    // This test double deliberately bypasses Next's image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    : <img {...rest} alt={typeof rest.alt === "string" ? rest.alt : ""} />;
}
