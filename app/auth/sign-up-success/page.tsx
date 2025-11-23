export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold">
          Account created!
        </h1>

        <p className="text-gray-400 leading-relaxed">
          We’ve sent a confirmation email to your inbox.<br />
          Please verify your email before logging in.
        </p>

        <a
          href="/auth/login"
          className="inline-block px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  )
}
