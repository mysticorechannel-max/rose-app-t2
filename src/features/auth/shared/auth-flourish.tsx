import Image from "next/image";

interface AuthFlourishProps {
  position: "top" | "bottom";
}

export default function AuthFlourish({
  position,
}: AuthFlourishProps) {
  const isBottom = position === "bottom";

  return (
    <div className="flex justify-center">
      {/* Light Theme */}
      <Image
        src="/images/auth/separator-11.png"
        alt=""
        width={280}
        height={45}
        className={`h-auto ${isBottom ? "rotate-180" : ""} dark:hidden`}
      />

      {/* Dark Theme */}
      <Image
        src="/images/auth/separator-12.png"
        alt=""
        width={280}
        height={45}
        className={`hidden h-auto ${isBottom ? "rotate-180" : ""} dark:block`}
      />
    </div>
  );
}