
"use client";

import Link from "next/link";
import { Trophy, Brain, Play, Menu, LogIn, LogOut, UserCircle, Loader2, Home } from "lucide-react"; // Added Home icon
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Home", icon: Home }, // Added Home link
    { href: "/play", label: "Game", icon: Play },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 shadow-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-primary group-hover:text-accent transition-colors duration-300" />
          <span className="font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary group-hover:opacity-90 transition-opacity duration-300">
            Cash Me If You Can
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => (
            <Link href={link.href} passHref key={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm sm:text-base font-medium px-3 sm:px-4 py-2",
                  pathname === link.href
                    ? "text-primary hover:text-primary/90 bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <link.icon className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {link.label}
              </Button>
            </Link>
          ))}
          {loading ? (
             <Button variant="ghost" size="icon" disabled>
                <Loader2 className="h-5 w-5 animate-spin" />
             </Button>
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground hidden lg:inline-block ml-2 mr-1">
                Hi, {user.displayName || user.email?.split('@')[0]}
              </span>
              <Button variant="outline" size="sm" onClick={signOut} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">
                  <LogIn className="mr-1.5 h-4 w-4" /> Sign In
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">
                  <UserCircle className="mr-1.5 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation (Hamburger) */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation links for the site.</SheetDescription>
              <div className="flex flex-col space-y-3">
                <Link href="/" className="flex items-center space-x-2 group mb-4" onClick={() => setIsSheetOpen(false)}>
                  <Brain className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                    Cash Me If You Can
                  </span>
                </Link>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} passHref>
                      <Button
                        variant={pathname === link.href ? "default" : "ghost"}
                        className="w-full justify-start text-md py-3"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                <hr className="my-2 border-border" />
                {loading ? (
                    <div className="flex justify-center py-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Hi, {user.displayName || user.email?.split('@')[0]}
                    </div>
                    <Button variant="outline" onClick={() => { signOut(); setIsSheetOpen(false);}} className="w-full justify-start text-md py-3">
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/auth/signin" passHref>
                        <Button variant="ghost" className="w-full justify-start text-md py-3">
                          <LogIn className="mr-3 h-5 w-5" /> Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/auth/signup" passHref>
                        <Button variant="default" className="w-full justify-start text-md py-3">
                          <UserCircle className="mr-3 h-5 w-5" /> Sign Up
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
