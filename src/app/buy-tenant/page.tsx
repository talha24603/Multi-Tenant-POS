"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

// Load Stripe only once
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

export default function BuyTenantPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlanSelect = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      // Create a Checkout Session on your server
      const res = await fetch(`/api/create-subscription`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const { sessionId } = await res.json();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-4xl bg-card shadow-lg rounded-xl p-8 border border-border">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Your Business Tenant</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Set up a new tenant to manage your business, sales, and team. Choose a plan and get started instantly.
        </p>

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
          <button
            disabled={!selectedPlan || loading}
            onClick={handleCheckout}
            className="w-full max-w-xs mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Proceed to Checkout"}
          </button>
        </div>
      </div>
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

