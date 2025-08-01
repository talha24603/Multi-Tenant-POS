"use client"
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="Logo" width={36} height={36} className="dark:invert" />
          <span className="font-bold text-xl tracking-tight">POS SaaS</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#pricing" className="hover:text-primary transition">Pricing</a>
          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow hover:bg-destructive/90 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <a href="/sign-in" className="hover:text-primary transition">Sign In</a>
              <a href="/sign-up" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition">Sign Up</a>
            </>
          )}
        </div>
        {/* Mobile menu icon placeholder (optional for future) */}
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center gap-6">
        <Image src="/next.svg" alt="Logo" width={80} height={80} className="mx-auto mb-4 dark:invert" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">Supercharge Your Business with POS SaaS</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-6">
          Streamline sales, manage inventory, and grow your business with our all-in-one Point of Sale platform.
        </p>
        <a
          href="/sign-up"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-primary/90 transition"
        >
          Get Started Free
        </a>
      </header>

      {/* Features Section */}
      <section id="features" className="py-12 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-3">
            <Image src="/window.svg" alt="Easy Sales" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg">Effortless Sales</h3>
            <p className="text-sm text-muted-foreground">Quickly process transactions and accept multiple payment methods.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Image src="/file.svg" alt="Inventory" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg">Inventory Management</h3>
            <p className="text-sm text-muted-foreground">Track stock in real-time and get alerts for low inventory.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Image src="/globe.svg" alt="Analytics" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg">Powerful Analytics</h3>
            <p className="text-sm text-muted-foreground">Gain insights with sales reports and customer analytics.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section Placeholder */}
      <section id="pricing" className="py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-lg text-muted-foreground mb-6">Flexible plans for businesses of all sizes. (Details coming soon)</p>
        <a
          href="/sign-up"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-primary/90 transition"
        >
          Start Your Free Trial
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} POS SaaS. All rights reserved.
      </footer>
    </div>
  );
}
