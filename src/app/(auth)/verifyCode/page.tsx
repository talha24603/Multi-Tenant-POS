"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import codeVerificationHandler from "./codeVerificationHandler";

export default function VerifyCodePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();

  const handleVerify = async (e: any) => {
    e.preventDefault();

    // Check if searchParams is not null
    const email = searchParams?.get("email");
    if (!email) {
      toast.error("Email parameter is missing.");
      return;
    }

    console.log("Verification Code:", code);
    const response = await codeVerificationHandler(code, email);

    if (response?.success) {
      router.push("/sign-in");
      toast.success("Code verified successfully");
    } else {
      toast.error("Code doesn't match");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Image src="/2.png" alt="Logo" width={100} height={50} />
          {/* <h2 className="text-2xl font-bold text-blue-500">Sidz</h2> */}
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground mb-2">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleVerify}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                minLength={6}
                autoFocus
                placeholder="123456"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                required
                className="tracking-widest text-center text-lg"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">Code verified! Redirecting...</div>}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 