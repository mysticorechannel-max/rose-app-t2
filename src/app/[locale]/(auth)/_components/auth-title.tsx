interface AuthTitleProps {
  children: React.ReactNode;
}

export default function AuthTitle({ children }: AuthTitleProps) {
  return (
<h1 className="font-script text-center text-5xl leading-relaxed text-text-primary mb-8 border-border-soft border-solid border-b pb-6">
  {children}
</h1>
  );
}