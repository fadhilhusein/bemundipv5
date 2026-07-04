type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container-shell ${className}`}>{children}</div>;
}
