import clsx from "clsx";
import Logo from "../assets/logo.svg";
import LogoDark from "../assets/LogoDark.svg";

export default function AppLogo({ theme = "light", compact = false, className = "" }) {
  return (
    <img
      src={compact ? "/one-pos-icon.svg" : theme === "black" ? LogoDark : Logo}
      alt="OneOs Pos"
      className={clsx(
        "block object-contain",
        compact ? "h-12 w-12 shrink-0" : "h-12 min-w-0 w-auto max-w-full",
        className
      )}
    />
  );
}
