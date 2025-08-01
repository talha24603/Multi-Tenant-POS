"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";

interface SubscriptionCheckoutProps {
  planType: "MONTHLY" | "YEARLY";
  amount?: number;
}

const SubscriptionCheckout = ({ planType, amount }: SubscriptionCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");
  const session = useSession();
  const userId = session.data?.user?.id;

  useEffect(() => {
    console.log("🔄 SubscriptionCheckout useEffect triggered");
    console.log("👤 Session status:", session.status);
    console.log("👤 User ID:", userId);
    console.log("👤 Full session data:", session.data);
    console.log("📦 Plan type:", planType);
    console.log("💰 Amount:", amount);
    
    if (session.status === "loading") {
      console.log("⏳ Session still loading...");
      return;
    }
    
    if (!userId) {
      console.log("❌ No userId available, skipping subscription creation");
      setErrorMessage("Please log in to continue");
      return;
    }

    console.log("💳 Creating subscription...");
    fetch("/api/stripe/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, planType }),
    })
      .then((res) => {
        console.log("📡 API Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Subscription created:", data.subscriptionId ? "Success" : "Failed");
        console.log("🔑 Client secret received:", data.clientSecret ? "Yes" : "No");
        console.log("📦 Full response data:", data);
        
        if (data.error) {
          console.error("❌ API Error:", data.error);
          setErrorMessage(data.error);
        } else if (!data.clientSecret) {
          console.error("❌ No client secret in response");
          setErrorMessage("Payment configuration error");
        } else {
          console.log("✅ Setting client secret and subscription ID");
          setClientSecret(data.clientSecret);
          setSubscriptionId(data.subscriptionId);
        }
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
        setErrorMessage("Failed to create subscription");
      });
  }, [planType, userId, session.status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    console.log("🚀 Subscription payment submission started");

    if (!stripe || !elements) {
      console.error("❌ Stripe or Elements not available");
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.error("❌ Submit error:", submitError);
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    console.log("✅ Elements submitted successfully");

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?subscriptionId=${subscriptionId}&planType=${planType}`,
      },
    });

    if (error) {
      console.error("❌ Payment confirmation error:", error);
      setErrorMessage(error.message);
    } else {
      console.log("✅ Payment confirmed successfully - redirecting to success page");
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const planName = planType === "MONTHLY" ? "Monthly" : "Yearly";
  const planPrice = planType === "MONTHLY" ? 19 : 190;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Complete Your {planName} Subscription</h3>
        <p className="text-gray-600 mb-4">
          You're subscribing to the {planName.toLowerCase()} plan for ${planPrice}/{planType === "MONTHLY" ? "month" : "year"}
        </p>
      </div>

      {clientSecret && <PaymentElement />}

      {errorMessage && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded border border-red-200">
          {errorMessage}
        </div>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!loading ? `Subscribe to ${planName} Plan - $${planPrice}` : "Processing..."}
      </button>
    </form>
  );
};

export default SubscriptionCheckout; 