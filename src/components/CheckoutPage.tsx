"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useSession } from "next-auth/react";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  useEffect(() => {
    console.log("🔄 CheckoutPage useEffect triggered");
    console.log("👤 User ID:", userId);
    console.log("💰 Amount:", amount);
    
    if (!userId) {
      console.log("❌ No userId available, skipping PaymentIntent creation");
      return;
    }

    console.log("💳 Creating PaymentIntent...");
    fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount), userId }),
    })
      .then((res) => {
        console.log("📡 API Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ PaymentIntent created:", data.clientSecret ? "Success" : "Failed");
        if (data.error) {
          console.error("❌ API Error:", data.error);
          setErrorMessage(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
        setErrorMessage("Failed to create payment intent");
      });
  }, [amount, userId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    console.log("🚀 Payment submission started");

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
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;