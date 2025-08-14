"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import signInWithGoogle from "../sign-up/signUpWithGoogle"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
})

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const user = session.data?.user || {};
  const status = session?.status || "loading";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      console.log("Attempting sign in with:", { email, password });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      console.log("Sign in response:", result);
      if (!result || result.error) {
        console.error("Sign in error:", result?.error);
        if (result?.error?.includes("fetch")) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(result?.error || "Invalid email or password");
        }
        return;
      }
  
      if (result?.ok) {
        toast.success("Login successful!");
        console.log("Sign in successful, waiting for session update...");
        // Don't redirect here - let the useEffect handle it based on role
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      console.log("Attempting Google sign in...");
      await signInWithGoogle();
      // The redirect will be handled by NextAuth after successful authentication
      // The useEffect will detect the session change and handle the redirect
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  const redirectBasedOnRole = (role: string | null | undefined, tenantId: string | null | undefined) => {
    console.log("Redirecting based on role:", role, "tenantId:", tenantId);
    
    // If user has no tenant, redirect to buy tenant page
    // Exception: superAdmin doesn't need a tenant
    if (!tenantId && role !== "superAdmin") {
      console.log("No tenant found, redirecting to buy-tenant");
      router.push("/buy-tenant");
      return;
    }
    
    // Redirect based on role
    if (role === "superAdmin") {
      console.log("Redirecting to super admin dashboard");
      router.push("/admin/super-admin");
    } else if (role === "OWNER") {
      console.log("Redirecting to admin dashboard");
      router.push("/admin");
    } else if (role === "MANAGER") {
      console.log("Redirecting to manager dashboard");
      router.push("/manager/dashboard");
    } else if (role === "CASHIER") {
      console.log("Redirecting to cashier dashboard");
      router.push("/cashier");
    } else {
      console.log("No role or unknown role, redirecting to home");
      router.push("/");
    }
  }

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    
    if (status === "loading") {
      console.log("Session is loading...");
      return;
    }
    
    if (status === "unauthenticated") {
      console.log("User is not authenticated");
      return;
    }
    
    if (status === "authenticated" && session?.data?.user) {
      const role = session.data.user.role;
      const tenantId = session.data.user.tenantId;
      
      console.log("User role:", role);
      console.log("User tenantId:", tenantId);
      
      // Small delay to ensure session is fully loaded
      const timeoutId = setTimeout(() => {
        redirectBasedOnRole(role, tenantId);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [status, session, router]);

  // If user is already authenticated, show loading
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Card className="w-full max-w-md shadow-none border-none">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center  bg-white">
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between  bg-background/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
          <Image src="/2.png" alt="SIDZ" width={100} height={40} />
          </Link>
          {/* <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">SIDDZ</span> */}
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <a href="/features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="/buy-tenant" className="hover:text-primary transition-colors duration-200">Pricing</a>
          <a href="/reviews" className="hover:text-primary transition-colors duration-200">Reviews</a>
          	{/* {user ?(
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          ) : ( */}
            <>
              <a href="/sign-in" className="hover:text-primary transition-colors duration-200">Sign In</a>
              <a href="/sign-up" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-xl">Sign Up</a>
            </>
          {/* )} */}
        </div>
      </nav>
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="flex flex-col items-center ">
          {/* <Image src="/2.png" alt="Logo" width={48} height={100} /> */}
          <CardTitle className="font-sans text-3xl font-bold mb-10">Sign in to SIDZ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                required 
                autoComplete="email" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"  
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                autoComplete="current-password" 
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading || googleLoading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-muted" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-muted" />
          </div>
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-base font-medium"
            disabled={loading || googleLoading}
          >
            <FcGoogle className="h-5 w-5" />
            {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
          </Button>
          <div className="text-center text-sm text-muted-foreground mt-2 mb-10">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}