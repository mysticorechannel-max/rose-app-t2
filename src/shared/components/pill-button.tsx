import Link from "next/link";


export default function PillButton({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#FDEEEE] px-[15px] py-[7px] text-[13px] font-semibold text-[#A62027] transition hover:-translate-y-px hover:bg-white"
    >
      {children}
    </Link>
  );
}
