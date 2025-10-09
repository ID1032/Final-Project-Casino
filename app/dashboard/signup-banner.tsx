'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { LoginModal } from '@/components/login-modal';
import Image from 'next/image';
import banner from './banner.jpeg';

export function SignupBanner() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <Card className='overflow-hidden border-0 shadow-lg'>
        <CardContent className='p-0'>
          <Image
            src={banner}
            alt='Signup promotion banner'
            className='mx-auto w-full  h-auto rounded-md shadow-md'
            priority
          />
        </CardContent>
      </Card>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
