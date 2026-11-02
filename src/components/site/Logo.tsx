import { Link } from "@tanstack/react-router";
import logo from "@/assets/itools-logo.png";

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex h-10 w-28 shrink-0 items-center"
      aria-label="i-Tools — página inicial"
    >
      <img src={logo} alt="i-Tools" width={660} height={200} className="block h-auto w-full" />
    </Link>
  );
}
