
import Link from 'next/link';
import Image from 'next/image';
import { School } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'login-background');
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                    <School className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold font-headline">Predictive Analytics for Student Performance</span>
                </Link>
                <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your information to create a new account
                </p>
              </div>
              <SignupForm />
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block relative">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                />
            )}
          </div>
        </div>
      )
}
