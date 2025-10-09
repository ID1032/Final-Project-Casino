'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import banner from './banner.jpeg';
import Link from 'next/link';

export function SignupBanner() {
  return (
    <Card className='overflow-hidden border-0 shadow-lg'>
      <CardContent className='p-0'>
        <Link href='/login'>
          <Image
            src={banner}
            alt='Signup promotion banner'
            className='mx-auto w-full  h-auto rounded-md shadow-md'
            priority
          />
        </Link>
      </CardContent>
    </Card>
  );
}
