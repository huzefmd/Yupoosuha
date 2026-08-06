import logo from "@/assets/logo.jpg";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Yupoosuha logo"
        width={40}
        height={40}
        loading="eager"
        className="h-10 w-10 rounded-lg bg-white object-contain p-0.5"
      />
      {!compact && (
        <span className="text-lg font-semibold tracking-tight">Yupoosuha</span>
      )}
    </span>
  );
}
