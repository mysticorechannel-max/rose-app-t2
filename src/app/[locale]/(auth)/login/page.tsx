import AuthLayout from "@/features/auth/shared/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-semibold">
          Welcome back!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your details to sign in.
        </p>
      </div>
    </AuthLayout>
  );
}