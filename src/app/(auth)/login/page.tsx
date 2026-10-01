"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const result = await login(email);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] bg-white rounded-3xl border border-border p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            
            {/* Logo */}
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-sm shadow-primary/30 mb-2">
              <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
            </Link>

            <div className="space-y-1.5 w-full">
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
            </div>

            <form className="space-y-4 w-full text-left" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required className="rounded-xl h-11 bg-muted/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</Label>
                  <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl h-11 bg-muted/30" />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all group">
                {isLoading ? "Signing in..." : "Sign in to account"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <p className="text-sm text-muted-foreground pt-4 border-t border-border w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
