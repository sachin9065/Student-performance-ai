
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { School, BrainCircuit, ShieldCheck, BarChart, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold font-headline">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
            <School className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">Risk Insights</span>
        </Link>
        <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:py-24">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Empower Educators with AI-Powered Student Insights
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Risk Insights helps you identify at-risk students early, providing data-driven analytics and predictive insights to foster academic success.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-auto">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Key Features for Educational Success</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Everything you need to support your students, all in one platform.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard 
                        icon={BarChart} 
                        title="Comprehensive Dashboard" 
                        description="Visualize student data, track trends, and monitor risk levels with an intuitive and interactive dashboard." 
                    />
                    <FeatureCard 
                        icon={BrainCircuit} 
                        title="AI-Powered Insights" 
                        description="Leverage generative AI to get predictive insights and understand the 'why' behind each student's risk score." 
                    />
                    <FeatureCard 
                        icon={Users} 
                        title="Easy Data Management" 
                        description="Quickly add individual students or perform bulk uploads via CSV to get your roster set up in minutes." 
                    />
                    <FeatureCard 
                        icon={ShieldCheck} 
                        title="Secure & Reliable" 
                        description="Built on Firebase, ensuring your data is secure and the platform is scalable to your needs." 
                    />
                </div>
            </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Make a Difference?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Sign up today and start leveraging the power of AI to support your students more effectively.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            <p className="text-sm font-bold">Risk Insights</p>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Risk Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
