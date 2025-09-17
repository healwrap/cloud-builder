import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-white text-black hover:bg-gray-100 text-sm normal-case",
              card: "bg-gray-900 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "border-gray-600 text-white hover:bg-gray-800",
              socialButtonsBlockButtonText: "text-white",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800 border-gray-600 text-white",
              footerActionLink: "text-white hover:text-gray-300",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-white",
            },
          }}
        />
      </div>
    </div>
  );
}