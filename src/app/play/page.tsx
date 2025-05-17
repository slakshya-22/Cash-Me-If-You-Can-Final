
"use client";

import { GameArea } from "@/components/game/GameArea";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreativeLoader } from "@/components/ui/creative-loader";

function PlayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const mode = searchParams.get('mode') || "Mixed";
  const category = searchParams.get('category') || "General Knowledge";

  useEffect(() => {
    if (!loading && !user) {
      const redirectTo = `/play?mode=${mode}&category=${encodeURIComponent(category)}`;
      router.push(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [user, loading, router, mode, category, searchParams]); // Added searchParams to dependency array

  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)] p-4">
        <CreativeLoader text={loading ? "Authenticating..." : "Redirecting to sign in..."} />
      </div>
    );
  }

  return <GameArea gameMode={mode} gameCategory={category} />;
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)] p-4">
        <CreativeLoader text="Loading game settings..." />
      </div>
    }>
      <PlayPageContent />
    </Suspense>
  );
}
