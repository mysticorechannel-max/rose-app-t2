import { cn } from "@/lib/utils";

const TOTAL = 4;

/** current: 1-based index shown in Figma (OTP = 2, Profile = 3, Password = 4). */
export function RegisterStepper({ current, label }: { current: number; label: string }) {
  return (
    <ol aria-label={label} className="flex w-full items-center">
      {Array.from({ length: TOTAL }, (_, i) => {
        const n = i + 1;
        const reached = n <= current;
        const active = n === current;

        return (
          <li key={n} className="flex items-center last:flex-none not-last:flex-1">
            {/* dot */}
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative z-10 flex size-[26px] shrink-0 items-center justify-center rounded-full text-xs font-medium",
                reached
                  ? "bg-bg-primary text-text-inverse ]"
                  : "bg-bg-secondary-fade text-text-primary",
                active &&
                  "shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#f1cfd2] dark:shadow-[0_0_0_3px_#1a1a1a,0_0_0_5px_#6b2a30]",
              )}
            >
              {n}
            </span>

            {n < TOTAL && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1",
                  n < current
                    ? "bg-bg-primary"
                    : "bg-bg-secondary-fade",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
