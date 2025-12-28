import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-studio-charcoal">
      <h1 className="text-5xl md:text-7xl font-serif text-studio-white mb-4">
        404
      </h1>

      <h2 className="text-xl md:text-2xl text-studio-gray mb-6">
        Page not found
      </h2>

      <p className="max-w-md text-studio-gray mb-8">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-block px-6 py-3 bg-studio-white text-studio-black rounded-md font-medium hover:opacity-90 transition"
      >
        Go back to home
      </Link>
    </main>
  );
}
