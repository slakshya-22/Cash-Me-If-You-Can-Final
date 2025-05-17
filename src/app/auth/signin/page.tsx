
// src/app/auth/signin/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { loading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRedirect = useCallback(() => {
    const redirectPath = searchParams?.get("redirect"); // Added optional chaining
    if (redirectPath) {
      router.push(decodeURIComponent(redirectPath));
    } else {
      router.push("/");
    }
  }, [router, searchParams]);
  
  useEffect(() => {
    if (!authLoading && user) {
      handleRedirect();
    }
  }, [user, authLoading, handleRedirect]);


  const onSubmit = async (data: SignInFormValues) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Signed In Successfully!",
        description: "Welcome back!",
      });
      // Redirect is handled by useEffect above
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      }
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isSubmitting || authLoading;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-12rem)] py-8">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-md border-primary/30">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your account to play "Cash Me If You Can".
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading && !authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with Email
              </Button>
            </CardContent>
          </form>
        </Form>
        
        <CardFooter className="flex flex-col space-y-2 pt-6">
            <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
                <Link href={`/auth/signup${searchParams?.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ''}`}>Sign Up</Link>
            </Button>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
