"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import SignUpHandler from "./SignUpHandler"
import signInWithGoogle from "./signUpWithGoogle"
import { signOut, useSession } from "next-auth/react"

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const payload = { name, email, password }


    try {
      const response = await SignUpHandler(payload as any)

      if (response?.alreadyIsAlready) {
        toast.error(response.alreadyIsAlready)
      } else if (response?.redirectUrl) {
        toast.success("Account created successfully!")
        router.push(response.redirectUrl)
      }
    } catch (error) {
      toast.error("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }
 


  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Navbar - Fixed at top */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between  bg-background/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/2.png" alt="SIDZ" width={100} height={40} />
          {/* <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">SIDDZ</span> */}
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors duration-200">Pricing</a>
          <a href="#testimonials" className="hover:text-primary transition-colors duration-200">Reviews</a>
          {/* {status === "authenticated" ? (
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

      {/* Main content - Centered */}
      {/* <div className=" mt-0 flex-1 flex items-center justify-center px-4 py-8"> */}
        <Card className=" w-full max-w-md shadow-none border-none">
          <CardHeader className="flex flex-col items-center ">
            {/* <Image src="/logo.svg" alt="Logo" width={48} height={48} /> */}
            <CardTitle className=" text-3xl font-bold mb-6">Create your SIDZ account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required autoComplete="name" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full mt-2">Sign Up</Button>
            </form>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-muted" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-muted" />
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-base font-medium" onClick={signInWithGoogle}>
              <FcGoogle className="h-5 w-5" />
              Sign up with Google
            </Button>
            <div className="text-center text-sm text-muted-foreground ">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    // </div>
  )
} 