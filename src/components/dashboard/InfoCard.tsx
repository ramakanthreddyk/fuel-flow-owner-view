
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  cta?: ReactNode;
  locked?: boolean;
  lockHint?: string;
  premium?: boolean;
  className?: string;
  blur?: boolean;
}

export function InfoCard({
  icon,
  title,
  description,
  cta,
  locked,
  lockHint,
  premium,
  className,
  blur,
}: InfoCardProps) {
  const content = (
    <Card
      className={cn(
        "rounded-xl shadow-md bg-white p-0 transition-all h-full",
        locked || blur ? "opacity-70" : "",
        premium ? "border-2 border-dashed border-yellow-300 bg-yellow-50/60" : "",
        className
      )}
    >
      <CardContent className="pt-7 pb-6 flex items-start gap-4">
        <div className={cn(
            "flex-none rounded-xl p-3 flex items-center justify-center text-white",
            premium ? "bg-yellow-500" : locked ? "bg-gray-300" : "bg-primary"
        )}>
          {locked ? <Lock className="w-8 h-8 text-white" /> : icon}
        </div>
        <div className={cn("flex-1", blur ? "blur-sm pointer-events-none select-none" : "")}>
          <div className={cn("font-semibold text-lg", locked ? "text-gray-500" : premium ? "text-yellow-900" : "text-gray-800")}>{title}</div>
          <div className={cn("mt-1 mb-3 text-sm", locked ? "text-gray-400" : "text-gray-600")}>{description}</div>
          {cta && (
            <div className="mt-2">{cta}</div>
          )}
        </div>
      </CardContent>
      {lockHint && locked && (
        <div className="px-6 pb-5 flex items-center gap-2 text-xs text-gray-400">
          <Lock className="w-4 h-4" />
          {lockHint}
        </div>
      )}
    </Card>
  );
  if (locked && lockHint) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{lockHint}</TooltipContent>
      </Tooltip>
    );
  }
  return content;
}
