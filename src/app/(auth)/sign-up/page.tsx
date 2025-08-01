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

export default function SignUpPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          <CardTitle className="text-2xl font-bold">Create your POS account</CardTitle>
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
          <div className="text-center text-sm text-muted-foreground mt-2">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 