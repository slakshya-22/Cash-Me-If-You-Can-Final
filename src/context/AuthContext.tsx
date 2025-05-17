// src/context/AuthContext.tsx
"use client";

import type { User } from "firebase/auth";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // useSearchParams removed

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  // searchParams and handleRedirect removed as they are not used by AuthProvider directly
  // and were causing issues with 404 page builds.
  // Redirect logic after sign-in/sign-up is handled within those specific pages.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push("/"); // Redirect to home page after sign out
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign Out Error",
        description: "Could not sign you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
