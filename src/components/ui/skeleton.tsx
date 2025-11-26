import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("relative overflow-hidden rounded-[var(--radius-md)]", className)}
      style={{
        backgroundColor: 'var(--color-muted)',
      }}
      {...props}
    >
      <div 
        className="absolute inset-0 animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(95, 85, 238, 0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}

export { Skeleton };