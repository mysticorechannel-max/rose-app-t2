interface AuthTitleProps {
  children: React.ReactNode;
}

export default function AuthTitle({ children }: AuthTitleProps) {
  return (
    <h1 className="font-script text-center text-4xl">
      {children}
    </h1>
  );
}