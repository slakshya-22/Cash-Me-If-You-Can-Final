
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
// Removed unused Image import
import { PlayCircle, Brain, Settings, ChevronRight, Tv, Sparkles, HelpCircle, Mail, Gamepad2, Workflow, Layers, Rocket, Smartphone, UserCircle, LogIn, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type GameMode = "Mixed" | "Easy" | "Medium" | "Hard";
type GameCategory = "General Knowledge" | "Sports" | "History" | "Geography" | "Science";

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("Mixed");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("General Knowledge");
  const { user, loading } = useAuth();
  const router = useRouter();

  const gameModes: GameMode[] = ["Mixed", "Easy", "Medium", "Hard"];
  const gameCategories: GameCategory[] = [
    "General Knowledge",
    "Sports",
    "History",
    "Geography",
    "Science",
  ];

  const faqItems = [
    {
      value: "item-1",
      question: "How are points awarded?",
      answer: "Points are awarded based on question difficulty, following a progressive scale. The further you get, the more points each question is worth, leading to a high-stakes, exciting finish!"
    },
    {
      value: "item-2",
      question: "Are the questions different each time I play?",
      answer: "Absolutely! Our game uses advanced AI to generate fresh and unique trivia questions for every session, ensuring a new challenge every time you play."
    },
    {
      value: "item-3",
      question: "How do the lifelines work?",
      answer: "You have three powerful lifelines: 50:50 (removes two incorrect answers), Phone-A-Friend (gets an AI-generated hint), and Audience Poll (shows how a virtual audience 'voted'). Use them wisely!"
    },
    {
      value: "item-4",
      question: "Can I play on my mobile device?",
      answer: "Yes! Cash Me If You Can is fully responsive and designed to provide a seamless experience on desktops, tablets, and mobile phones."
    },
    {
      value: "item-5",
      question: "What happens if I answer incorrectly?",
      answer: "If you answer a question incorrectly, the game ends. Your current score will be recorded, and you'll have the option to save it to the leaderboard if it's a high score!"
    }
  ];

  const handlePlayNowClick = () => {
    if (!user && !loading) {
      router.push(`/auth/signin?redirect=/play?mode=${selectedMode}&category=${encodeURIComponent(selectedCategory)}`);
    } else if (user) {
      router.push(`/play?mode=${selectedMode}&category=${encodeURIComponent(selectedCategory)}`);
    }
  };
  
  const handleConfigureAndPlayClick = () => {
    if (!user && !loading) {
      router.push('/auth/signin?redirect=/');
    } else {
      // Smooth scroll to the top where the game settings are
      const settingsCard = document.getElementById('game-settings-card');
      if (settingsCard) {
        settingsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4 sm:p-6 md:p-8 space-y-20 sm:space-y-24 md:space-y-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-8 sm:pt-12">
        <div className="p-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mb-6 shadow-lg animate-pulse">
          <Brain className="h-16 w-16 sm:h-20 sm:w-20 text-primary-foreground" />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 sm:mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            Cash Me If You Can
          </span>
        </h1>
        {user && (
          <p className="text-xl sm:text-2xl text-accent mb-6 font-medium">
            Welcome back, {user.displayName || user.email?.split('@')[0]}!
          </p>
        )}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-lg md:max-w-xl leading-relaxed">
          Step into the hot seat! Test your knowledge in this thrilling trivia game, customize your challenge, and climb the leaderboard.
        </p>

        <Card id="game-settings-card" className="w-full max-w-lg mb-10 sm:mb-12 shadow-2xl bg-card/90 backdrop-blur-lg border-2 border-primary/40 rounded-xl transition-all duration-300 hover:shadow-primary/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl flex items-center justify-center text-primary font-semibold">
              <Settings className="mr-3 h-7 w-7 animate-spin-slow" /> Game Settings
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-1">
              Tailor your trivia experience!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-3 text-left">
              <Label htmlFor="game-mode" className="text-md font-medium text-foreground flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5 text-primary"/> Difficulty Level
              </Label>
              <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value as GameMode)} disabled={loading}>
                <SelectTrigger id="game-mode" className="w-full text-base py-3 h-auto bg-input border-border focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {gameModes.map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-base cursor-pointer hover:bg-accent/20">
                      {mode === "Mixed" ? "Mixed Difficulty" : mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 text-left">
              <Label htmlFor="game-category" className="text-md font-medium text-foreground flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary"/> Topic Category
              </Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as GameCategory)} disabled={loading}>
                <SelectTrigger id="game-category" className="w-full text-base py-3 h-auto bg-input border-border focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {gameCategories.map((category) => (
                    <SelectItem key={category} value={category} className="text-base cursor-pointer hover:bg-accent/20">
                      {category === "General Knowledge" ? "General Knowledge (Mixed)" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handlePlayNowClick}
          size="lg"
          className="bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground hover:shadow-2xl hover:shadow-accent/50 hover:scale-105 transform transition-all duration-300 ease-in-out text-lg sm:text-xl px-10 sm:px-12 py-6 sm:py-7 group rounded-lg font-semibold"
          disabled={loading && !user}
        >
          {loading && !user ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <PlayCircle className="mr-2 h-6 w-6 sm:h-7 sm:w-7 group-hover:animate-ping" />}
          Let's Play!
          {!loading && <ChevronRight className="ml-2 h-6 w-6 sm:h-7 sm:w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" />}
        </Button>
        {!user && !loading && (
          <p className="mt-6 text-sm text-muted-foreground">
            <Link href="/auth/signin" className="text-primary hover:underline flex items-center group">
              <LogIn className="mr-1.5 h-4 w-4 group-hover:text-accent" /> Sign in to track your progress
            </Link>
          </p>
        )}
      </section>

      {/* About the Game Section */}
      <section className="w-full max-w-3xl lg:max-w-4xl px-2">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-md border-primary/30 rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-primary/80 via-primary/70 to-secondary/80 p-6 sm:p-8">
            <div className="inline-block mx-auto p-4 bg-background/20 rounded-full mb-4 shadow-lg">
                <Tv className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-primary-foreground">Step Into the Spotlight!</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground text-lg space-y-5 px-6 sm:px-8 py-8 leading-relaxed">
            <p>
              Welcome to "Cash Me If You Can," the ultimate trivia challenge where knowledge is power and quick thinking pays off! 
              Prepare to test your wits across various categories and difficulty levels.
            </p>
            <p>
              Answer 15 progressively harder questions, use your lifelines strategically, and aim for the top of the leaderboard. 
              Every game is a fresh experience thanks to our AI-powered question engine, ensuring endless fun and challenge.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-3xl lg:max-w-4xl px-2">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-md border-secondary/30 rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-secondary/80 via-secondary/70 to-accent/80 p-6 sm:p-8">
            <div className="inline-block mx-auto p-4 bg-background/20 rounded-full mb-4 shadow-lg">
              <Workflow className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-primary-foreground">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-left text-muted-foreground text-lg space-y-8 px-6 sm:px-8 py-10">
            {[
              { num: 1, title: "Sign Up / Sign In", description: "Create an account or sign in to track your progress and appear on the leaderboard.", icon: UserCircle },
              { num: 2, title: "Customize Your Challenge", description: "Select your preferred game mode (difficulty) and category before you start. Or, go with \"Mixed\" for a diverse experience!", icon: Settings },
              { num: 3, title: "Answer & Ascend", description: "Tackle 15 questions, each more challenging and valuable than the last. Race against the clock to lock in your answers.", icon: Brain },
              { num: 4, title: "Use Lifelines Wisely", description: "Feeling stuck? Utilize 50:50, Phone-A-Friend, or Audience Poll to gain an edge. But remember, each can only be used once!", icon: Sparkles },
              { num: 5, title: "Climb the Leaderboard", description: "After your game, save your score and see how you rank against other trivia masters. Aim for the top spot!", icon: Trophy }
            ].map(step => (
              <div key={step.num} className="flex items-start space-x-4 p-4 bg-background/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-primary mb-1">{step.title}</h4>
                  <p className="leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Key Features Section */}
      <section className="w-full max-w-3xl lg:max-w-4xl px-2">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-md border-accent/30 rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-accent/80 via-accent/70 to-primary/80 p-6 sm:p-8">
             <div className="inline-block mx-auto p-4 bg-background/20 rounded-full mb-4 shadow-lg">
                <Sparkles className="h-12 w-12 text-accent-foreground" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-accent-foreground">Why You'll Love It</CardTitle>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 py-10">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-8 text-left text-muted-foreground text-lg">
              {[
                { icon: Brain, title: "Dynamic AI Questions", description: "Enjoy a fresh set of challenges every time you play, thanks to our AI-powered question generation." },
                { icon: Settings, title: "Customizable Gameplay", description: "Choose your preferred difficulty and category to tailor the game to your strengths." },
                { icon: Gamepad2, title: "Engaging Lifelines", description: "Use 50:50, Phone-A-Friend, and Audience Poll to navigate tough questions." },
                { icon: Layers, title: "Progressive Difficulty", description: "Questions get tougher as you advance, making each step more rewarding." },
                { icon: Trophy, title: "Competitive Leaderboard", description: "Save your high scores and compete for the top spot against other players." },
                { icon: Smartphone, title: "Sleek & Responsive", description: "Play seamlessly on any device, with a modern and intuitive interface." },
              ].map(feature => (
                <div key={feature.title} className="flex items-start space-x-4 p-5 rounded-lg bg-background/30 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full">
                    <feature.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQs Section */}
      <section className="w-full max-w-3xl lg:max-w-4xl px-2">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-md border-primary/30 rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-primary/80 via-primary/70 to-secondary/80 p-6 sm:p-8">
            <div className="inline-block mx-auto p-4 bg-background/20 rounded-full mb-4 shadow-lg">
                <HelpCircle className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-primary-foreground">Got Questions? We've Got Answers!</CardTitle>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 py-10">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqItems.map(faq => (
                <AccordionItem value={faq.value} key={faq.value} className="border-primary/20 bg-background/30 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <AccordionTrigger className="text-lg text-left hover:no-underline text-foreground data-[state=open]:text-primary data-[state=open]:font-semibold py-4 px-5 w-full rounded-t-lg data-[state=open]:bg-primary/5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-left text-muted-foreground pb-5 px-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Get In Touch Section */}
      <section className="w-full max-w-3xl lg:max-w-4xl px-2">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-md border-secondary/30 rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-secondary/80 via-secondary/70 to-accent/80 p-6 sm:p-8">
            <div className="inline-block mx-auto p-4 bg-background/20 rounded-full mb-4 shadow-lg">
                <Mail className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-primary-foreground">We'd Love to Hear From You!</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground text-lg space-y-6 px-6 sm:px-8 py-10 leading-relaxed">
            <p>
              Have feedback, suggestions, or just want to say hi? We're always looking to improve "Cash Me If You Can."
              Your thoughts help us make the game even better!
            </p>
            <Button asChild variant="outline" className="mt-4 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-lg px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link href="mailto:slakshyamainacc@gmail.com?subject=Feedback%20for%20Cash%20Me%20If%20You%20Can">
                Send Feedback
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       {/* Final Call to Action */}
      <section className="w-full flex flex-col items-center py-16 sm:py-20">
        <div className="p-4 bg-gradient-to-br from-accent via-primary to-secondary rounded-full mb-6 shadow-lg animate-bounce">
            <Rocket className="h-16 w-16 text-accent-foreground" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary tracking-tight">
          Ready to Test Your Knowledge?
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-md leading-relaxed">
          The hot seat is waiting. Choose your settings above or at the top of the page and start your journey to trivia stardom!
        </p>
        <Button
          size="lg"
          className="shadow-2xl hover:shadow-primary/50 text-xl sm:text-2xl px-12 sm:px-16 py-6 sm:py-7 group bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={handleConfigureAndPlayClick}
          disabled={loading && !user}
        >
            <PlayCircle className="mr-3 h-7 w-7 sm:h-8 sm:h-8 group-hover:animate-pulse" /> Configure & Play
        </Button>
      </section>
    </div>
  );
}
