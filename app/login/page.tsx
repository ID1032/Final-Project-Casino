'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleSignIn } from '@/lib/auth';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('login');
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(
    () => searchParams.get('callbackUrl') ?? '/home',
    [searchParams]
  );

  const handleGoogleSignIn = () => {
    handleSignIn(callbackUrl);
  };

  return (
    <div className='min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4'>
      <div className='w-full max-w-[880px] bg-gradient-to-b from-[#4C3519] to-[#C29467] border-2 border-[#DA7814] rounded-md overflow-hidden'>
        <div className=''>
          <div className='grid grid-cols-2 w-full py-[24px]'>
            <button
              type='button'
              onClick={() => setActiveTab('register')}
              className={`w-full text-center text-[24px] font-bold transition-colors ${
                activeTab === 'register' ? 'text-[#DA7814]' : 'text-[#A98057]'
              }`}
            >
              <span className='inline-flex items-center justify-center gap-3'>
                <span>Register</span>
                <span
                  className={`${
                    activeTab === 'register'
                      ? 'bg-[#DA7814] text-white'
                      : 'bg-[#A98057] text-[#D9D9D9] '
                  } text-[16px] font-semibold px-4 py-1 rounded-full`}
                >
                  ผู้ใช้ใหม่
                </span>
              </span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('login')}
              className={`w-full text-center text-[24px] font-bold transition-colors ${
                activeTab === 'login' ? 'text-[#DA7814]' : 'text-[#A98057]'
              }`}
            >
              Login
            </button>
          </div>
          <div className='h-1 w-full relative'>
            <div
              className={`absolute left-0 top-0 h-1 w-1/2 bg-[#DA7814] transition-transform duration-300 ${
                activeTab === 'register' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
          </div>
        </div>

        {activeTab === 'register' && (
          <div className='py-[56px] px-[80px]'>
            <div className='text-center mb-6'>
              <h1 className='text-white text-[24px] text-center font-bold'>
                CPE888, Welcome to Casino No.1 in CPE
              </h1>
            </div>

            <div className='space-y-4 flex flex-col items-center'>
              <Button
                onClick={handleGoogleSignIn}
                size='lg'
                className='bg-white rounded-full'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  width='64'
                  height='64'
                >
                  <path
                    fill='#FFC107'
                    d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917'
                  />
                  <path
                    fill='#FF3D00'
                    d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691'
                  />
                  <path
                    fill='#4CAF50'
                    d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44'
                  />
                  <path
                    fill='#1976D2'
                    d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917'
                  />
                </svg>
                Sign Up with Google
              </Button>

              <p className='text-center text-[20px] text-white'>
                By confirming, you accept the{' '}
                <span className='text-white italic font-[500]'>
                  terms and conditions.
                </span>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className='py-[56px] px-[80px]'>
            <div className='text-center mb-6'>
              <h1 className='text-white text-[24px] text-center font-bold'>
                CPE888, Welcome back!
              </h1>
            </div>

            <div className='space-y-4 flex flex-col items-center'>
              <Button
                onClick={handleGoogleSignIn}
                size='lg'
                className='bg-white rounded-full'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  width='64'
                  height='64'
                >
                  <path
                    fill='#FFC107'
                    d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691'
                  />
                  <path
                    fill='#FF3D00'
                    d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691'
                  />
                  <path
                    fill='#4CAF50'
                    d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44'
                  />
                  <path
                    fill='#1976D2'
                    d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917'
                  />
                </svg>
                Sign in with Google
              </Button>
              <p className='text-center text-[20px] text-white'>
                By confirming, you accept the{' '}
                <span className='text-white italic font-[500]'>
                  terms and conditions.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
