"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, ShoppingCart, Lock } from "lucide-react";
import Link from "next/link";

// Load Stripe only once
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

export default function BuyTenantPage() {
  
 
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log("User", user);

  const handlePlanSelect = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    // Check if user is authenticated
    if (status !== "authenticated") {
      router.push("/sign-in");
      return;
    }
    
    setLoading(true);
    try {
      // Create a Checkout Session on your server
      const res = await fetch(`/api/create-subscription`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const { sessionId } = await res.json();
      console.log("SessionId", sessionId);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe.js failed to load");

      // Redirect user to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating checkout. Please try again.");
      setLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 text-foreground font-sans">
      {/* Navbar */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
          <Image src="/2.png" alt="SIDZ" width={100} height={40} />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="/buy-tenant" className="text-primary">Pricing</a>
          <a href="/reviews" className="hover:text-primary transition-colors duration-200">Reviews</a>
          <a href="/sign-in" className="hover:text-primary transition-colors duration-200">Sign In</a>
          <a href="/sign-up" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-xl">Sign Up</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12 flex-1">
        <div className="w-full max-w-4xl bg-card shadow-lg rounded-xl p-8 border border-border">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Business Tenant</h1>
            {status === "authenticated" ? (
              <p className="text-muted-foreground mb-2">
                Welcome back, {session?.user?.name || session?.user?.email}!
              </p>
            ) : (
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-amber-200">
                <Lock className="w-4 h-4" />
                Sign in to purchase a tenant
              </div>
            )}
            <p className="text-muted-foreground">
              Set up a new tenant to manage your business, sales, and team. Choose a plan and get started instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlanCard
              title="Monthly Package"
              price="$19/mo"
              features={[
                "Full POS system access",
                "Basic reporting",
                "Email support",
                "Up to 5 team members",
              ]}
              selected={selectedPlan === "monthly"}
              onSelect={() => handlePlanSelect("monthly")}
            />

            <PlanCard
              title="Yearly Package"
              price="$190/yr"
              subtitle="Save $38/year"
              features={[
                "Full POS system access",
                "Advanced reporting",
                "Priority support",
                "Up to 10 team members",
                "2 months free",
              ]}
              selected={selectedPlan === "yearly"}
              onSelect={() => handlePlanSelect("yearly")}
            />
          </div>

          <div className="mt-8 text-center">
            {status === "authenticated" ? (
              <button
                disabled={!selectedPlan || loading}
                onClick={handleCheckout}
                className="w-full max-w-xs mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? "Redirecting…" : "Proceed to Checkout"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-muted-foreground mb-4">
                  Please sign in to continue with your purchase
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleSignInRedirect}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition hover:scale-105"
                  >
                    Sign In to Continue
                  </button>
                  <a
                    href="/sign-up"
                    className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition hover:scale-105"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">POS SaaS</span>
              </div>
              <p className="text-muted-foreground">
                The complete point-of-sale solution for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/buy-tenant" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/reviews" className="hover:text-foreground transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} POS SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable PlanCard component
function PlanCard({
  title,
  price,
  subtitle,
  features,
  selected,
  onSelect,
}: {
  title: string;
  price: string;
  subtitle?: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`border rounded-lg p-6 bg-background hover:border-primary transition-colors ${
        selected ? 'border-primary shadow-lg' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{price}</span>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      <ul className="space-y-2 mb-4 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
      >
        {selected ? "Selected" : "Choose"}
      </button>
    </div>
  );
}

