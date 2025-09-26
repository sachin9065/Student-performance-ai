import Image from 'next/image';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/signup-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { School } from 'lucide-react';

export default function SignUpPage() {
    const backgroundImage = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {backgroundImage && (
            <Image
                src={backgroundImage.imageUrl}
                alt={backgroundImage.description}
                data-ai-hint={backgroundImage.imageHint}
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
         <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <School className="h-8 w-8 text-primary" />
            <p className="text-2xl font-bold font-headline text-primary-foreground">Risk Insights</p>
          </div>
          <blockquote className="text-lg">
            &ldquo;Empowering educators with data-driven insights to foster student success.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
