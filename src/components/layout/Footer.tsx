
"use client";

import Link from 'next/link';
import { Brain, Github, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const contributors = [
    "Nupur Panwar",
    "Pranjal Kumar Rai",
    "Junjaram Choudhary",
    "Gaurav Gehlot",
    "Lakshya Sharma"
  ];

  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
            <Link href="/" className="flex items-center space-x-1.5 group">
              <Brain className="h-5 w-5 text-primary group-hover:text-accent transition-colors duration-300" />
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                Cash Me If You Can
              </span>
            </Link>
        </div>
        <div className="flex justify-center space-x-5 my-4">
          <a href="https://github.com/Lakshyasharma0410" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://www.linkedin.com/in/lakshya-sharma-448064229/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
        <div className="text-xs sm:text-sm">
          Created with ❤️ by:
          <div className="mt-1">
            {contributors.map((name, index) => (
              <span key={index} className="block">{name}</span>
            ))}
          </div>
        </div>
        <p className="text-xs mt-2">
          &copy; {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
