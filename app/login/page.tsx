'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerDobDay, setRegisterDobDay] = useState('');
  const [registerDobMonth, setRegisterDobMonth] = useState('');
  const [registerDobYear, setRegisterDobYear] = useState('');
  const [registerFieldErrors, setRegisterFieldErrors] = useState<
    Partial<
      Record<
        'email' | 'password' | 'confirmPassword' | 'day' | 'month' | 'year',
        string
      >
    >
  >({});
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(
    () => searchParams.get('callbackUrl') ?? '/home',
    [searchParams]
  );
  const supabase = useMemo(() => createClient(), []);

  const handleGoogleSignIn = async () => {
    const redirectTo = `${window.location.origin}${callbackUrl}`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) {
      console.error('Google sign-in error', error);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setFormError(error.message);
        return;
      }
      window.location.href = callbackUrl;
    } catch {
      setFormError('Unexpected error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterFieldErrors({});
    const registerSchema = z
      .object({
        email: z.string().email('Please enter a valid email address.'),
        password: z
          .string()
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            'Password must be 8+ chars with upper, lower, and number.'
          ),
        confirmPassword: z.string(),
        day: z.string().regex(/^\d{2}$/i, 'Day must be 2 digits'),
        month: z.string().regex(/^\d{2}$/i, 'Month must be 2 digits'),
        year: z.string().regex(/^\d{4}$/i, 'Year must be 4 digits'),
      })
      .refine(v => v.password === v.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });

    const parsed = registerSchema.safeParse({
      email: registerEmail,
      password: registerPassword,
      confirmPassword: registerConfirmPassword,
      day: registerDobDay,
      month: registerDobMonth,
      year: registerDobYear,
    });

    if (!parsed.success) {
      const issues = parsed.error.issues;
      const fieldErrors: Partial<
        Record<
          'email' | 'password' | 'confirmPassword' | 'day' | 'month' | 'year',
          string
        >
      > = {};
      for (const issue of issues) {
        const field = issue.path?.[0] as keyof typeof fieldErrors | undefined;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setRegisterFieldErrors(fieldErrors);
      return;
    }
    const submit = async () => {
      const emailForSignup = registerEmail.trim();

      const redirectTo = `${window.location.origin}${callbackUrl}`;
      const { data, error } = await supabase.auth.signUp({
        email: emailForSignup,
        password: registerPassword,
        options: {
          data: {
            email: emailForSignup,
            date_of_birth: `${registerDobYear}-${registerDobMonth}-${registerDobDay}`,
          },
          emailRedirectTo: redirectTo,
        },
      });

      if (data.session) {
        window.location.href = callbackUrl;
        return;
      }
    };
    void submit();
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
              <form
                onSubmit={handleLocalRegister}
                className='w-full max-w-[560px] space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='reg-email' className='text-white text-[18px]'>
                    Email
                  </Label>
                  <Input
                    id='reg-email'
                    type='email'
                    placeholder='you@example.com'
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    required
                    className='bg-white/90'
                  />
                  {registerFieldErrors.email && (
                    <p className='text-red-200 text-sm'>
                      {registerFieldErrors.email}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='reg-password'
                    className='text-white text-[18px]'
                  >
                    Password
                  </Label>
                  <Input
                    id='reg-password'
                    type='password'
                    placeholder='Enter password'
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    required
                    className='bg-white/90'
                  />
                  {registerFieldErrors.password && (
                    <p className='text-red-200 text-sm'>
                      {registerFieldErrors.password}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='reg-confirm'
                    className='text-white text-[18px]'
                  >
                    Confirm password
                  </Label>
                  <Input
                    id='reg-confirm'
                    type='password'
                    placeholder='Confirm password'
                    value={registerConfirmPassword}
                    onChange={e => setRegisterConfirmPassword(e.target.value)}
                    required
                    className='bg-white/90'
                  />
                  {registerFieldErrors.confirmPassword && (
                    <p className='text-red-200 text-sm'>
                      {registerFieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label className='text-white text-[18px]'>
                    Enter Your Birth
                  </Label>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col gap-1'>
                      <Input
                        id='reg-day'
                        type='text'
                        inputMode='numeric'
                        // pattern='\\d{1,2}'
                        placeholder='dd'
                        value={registerDobDay}
                        onChange={e => setRegisterDobDay(e.target.value)}
                        required
                        className='bg-white/90'
                      />
                      <p className='h-4 text-red-200 text-xs'>
                        {registerFieldErrors.day ?? ' '}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Input
                        id='reg-month'
                        type='text'
                        inputMode='numeric'
                        // pattern='\\d{1,2}'
                        placeholder='mm'
                        value={registerDobMonth}
                        onChange={e => setRegisterDobMonth(e.target.value)}
                        required
                        className='bg-white/90'
                      />
                      <p className='h-4 text-red-200 text-xs'>
                        {registerFieldErrors.month ?? ' '}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Input
                        id='reg-year'
                        type='text'
                        inputMode='numeric'
                        // pattern='\\d{4}'
                        placeholder='yyyy'
                        value={registerDobYear}
                        onChange={e => setRegisterDobYear(e.target.value)}
                        required
                        className='bg-white/90'
                      />
                      <p className='h-4 text-red-200 text-xs'>
                        {registerFieldErrors.year ?? ' '}
                      </p>
                    </div>
                  </div>
                </div>

                <Button type='submit' size='lg' className='w-full bg-[#DA7814]'>
                  Confirm
                </Button>
              </form>

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
                Sign in with Google
              </Button>
              <div className='text-white text-[18px]'>or</div>

              <form
                onSubmit={handlePasswordSignIn}
                className='w-full max-w-[560px] space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-white text-[18px]'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className='bg-white/90'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='password' className='text-white text-[18px]'>
                    Password
                  </Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='bg-white/90'
                  />
                </div>
                {formError && (
                  <p className='text-red-200 text-sm'>{formError}</p>
                )}
                <Button
                  type='submit'
                  size='lg'
                  className='w-full bg-[#DA7814]'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Confirm'}
                </Button>
              </form>
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
