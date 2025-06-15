
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface LockedCardProps {
  title: string;
  description: string;
  className?: string;
}

export default function LockedCard({ title, description, className = "" }: LockedCardProps) {
  return (
    <Card className={`opacity-50 pointer-events-none text-center ${className}`}>
      <CardContent className="flex flex-col items-center py-8">
        <Lock className="text-gray-400 mb-2 w-8 h-8" />
        <p className="font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
