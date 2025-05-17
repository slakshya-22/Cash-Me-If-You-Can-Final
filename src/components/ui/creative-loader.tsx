
"use client";

import { cn } from "@/lib/utils";

interface CreativeLoaderProps {
  className?: string;
  size?: "small" | "medium" | "large";
  text?: string;
  textColorClassName?: string; 
}

export function CreativeLoader({
  className,
  size = "medium",
  text,
  textColorClassName = "text-muted-foreground",
}: CreativeLoaderProps) {
  
  const dotSizeClasses = {
    small: "w-2.5 h-2.5", // Increased slightly
    medium: "w-3 h-3",    // Increased slightly
    large: "w-4 h-4",     // Increased slightly
  };

  const containerHeightClass = { 
    small: "min-h-[4.5rem]",
    medium: "min-h-[5.5rem]",
    large: "min-h-[6.5rem]",
  };

  const textSizeClasses = {
    small: "text-xs sm:text-sm mt-3.5",
    medium: "text-sm sm:text-base mt-4",
    large: "text-base sm:text-lg mt-5",
  };

  // Base class for each dot, using the 'animate-wave-scale'
  const dotBaseClass = cn("rounded-full animate-wave-scale shadow-md", dotSizeClasses[size]);

  return (
    <div className={cn("flex flex-col justify-center items-center p-4", containerHeightClass[size], className)}>
      <div className="flex items-center justify-center space-x-2.5"> {/* Increased space slightly */}
        <div className={cn(dotBaseClass, "bg-primary animation-delay-0s")} />
        <div className={cn(dotBaseClass, "bg-accent animation-delay-150ms")} />
        <div className={cn(dotBaseClass, "bg-secondary animation-delay-300ms")} />
        <div className={cn(dotBaseClass, "bg-primary/70 animation-delay-450ms")} /> 
        <div className={cn(dotBaseClass, "bg-accent/70 animation-delay-[0.6s]")} /> {/* Added 5th dot */}
      </div>
      {text && (
        <p className={cn("text-center font-medium", textColorClassName, textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}
