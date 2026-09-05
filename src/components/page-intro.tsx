import { DISCLAIMER } from "@/lib/constants";

export function PageIntro({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {children && <p className="mt-2 max-w-3xl text-sm text-white/65">{children}</p>}
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
    </div>
  );
}
