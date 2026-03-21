import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  isLarge?: boolean;
  hideTextOnMobile?: boolean;
}

export function Logo({ className = "", isLarge = false, hideTextOnMobile = false }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-90 ${className}`}>
      <div className={`bg-primary flex items-center justify-center ${isLarge ? "w-10 h-10 rounded-xl" : "w-9 h-9 rounded-xl"}`}>
        <GraduationCap className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className={`tracking-tight text-foreground ${isLarge ? "text-xl font-semibold" : "text-lg font-bold"} ${hideTextOnMobile ? "hidden sm:block" : ""}`}>
        LearnFlow
      </span>
    </Link>
  );
}
