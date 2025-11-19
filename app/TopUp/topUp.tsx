'use client';

import * as React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  contentClassName?: string;
  titleClassName?: string;
}

//for mock withdraw & history
export default function Modal({
  title,
  children,
  isOpen,
  onClose,
  showCloseButton = true,
  contentClassName,
  titleClassName,
}: ModalProps) {
  const baseContainerClass =
    'w-full max-w-5xl rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur';
  const containerClass = `${baseContainerClass} ${
    contentClassName || 'bg-white/90'
  }`;
  const headingClass = `mb-6 text-center text-2xl font-extrabold uppercase tracking-wide md:text-3xl ${
    titleClassName || 'text-[#0F2D15]'
  }`;

  return (
    isOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
        <div className={containerClass}>
          <div className='px-6 py-6 md:px-10 md:py-8'>
            <h2 className={headingClass} >{title}</h2>
            <div>{children}</div>
            {showCloseButton && (
              <div className='mt-8 flex items-center justify-center'>
                <button
                  onClick={onClose}
                  className='rounded-full bg-red-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-600'
                  aria-label='Close'
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}

const BANKS = ['KBANK', 'SCB', 'BBL', 'GSB'] as const;
type BankCode = (typeof BANKS)[number];

type TopUpFormState = {
  bank: BankCode | '';
  accountNumber: string;
  amount: string;
  password: string;
};

type TopUpMessage =
  | { type: 'success' | 'error' | 'info'; text: string }
  | null;


//mock password , will need to fetch from backend
const USER_ACCOUNT_PASSWORD = 'casino123';

const createInitialTopUpForm = (): TopUpFormState => ({
  bank: '',
  accountNumber: '',
  amount: '',
  password: '',
});

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  //Surface amount back to parent so it can update balance (or call API)
  onSuccess: (amountAdded: number) => void;
  title?: string;
}

export function TopUpModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Top Up',
}: TopUpModalProps) {
  const [form, setForm] = React.useState<TopUpFormState>(
    createInitialTopUpForm()
  );
  const [message, setMessage] = React.useState<TopUpMessage>(null);
  const [isPasswordStep, setIsPasswordStep] = React.useState(false);

  // Reset form every time the modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm(createInitialTopUpForm());
      setMessage(null);
      setIsPasswordStep(false);
    }
  }, [isOpen]);

  // Shared helper to keep form state updates terse
  const handleInputChange = <K extends keyof TopUpFormState>(
    field: K,
    value: TopUpFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handles both “enter amount” and “confirm password” steps.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number(form.amount);

    if (!form.bank) {
      setMessage({
        type: 'error',
        text: 'Please choose a bank before continuing.',
      });
      return;
    }

    if (!form.accountNumber.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a bank account number.',
      });
      return;
    }

    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setMessage({
        type: 'error',
        text: 'Enter a valid top up amount greater than zero.',
      });
      return;
    }

    if (!isPasswordStep) {
      setIsPasswordStep(true);
      setMessage({
        type: 'info',
        text: 'Enter your account password to confirm this top up.',
      });
      return;
    }

    if (!form.password.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter your account password.',
      });
      return;
    }

    if (form.password !== USER_ACCOUNT_PASSWORD) {
      setMessage({
        type: 'error',
        text: 'Incorrect account password. Please try again.',
      });
      return;
    }

    // Inform parent so it can add amount or invoke real API later.
    onSuccess(amountValue);
    setMessage({
      type: 'success',
      text: `Success! ${amountValue.toLocaleString(
        'en-US'
      )} credits added to your wallet.`,
    });
    setForm(createInitialTopUpForm());
    setIsPasswordStep(false);
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      contentClassName='bg-gradient-to-b from-[#1E7027] via-[#4CAF50] to-[#E3D8C6] text-white'
      titleClassName='text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-6 text-white md:gap-8'
      >
        <div className='space-y-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm uppercase tracking-[0.25em] text-white/85'>
              Choose bank
            </label>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
              <div className='relative w-full max-w-[200px]'>
                <select
                  value={form.bank}
                  onChange={(e) =>
                    handleInputChange('bank', e.target.value as BankCode | '')
                  }
                  className='w-full appearance-none rounded-2xl border-2 border-[#E29B4C] bg-white px-4 py-2 text-base font-semibold uppercase text-[#2F1A0C] shadow-[0_6px_14px_rgba(0,0,0,0.2)] outline-none transition focus:ring-2 focus:ring-[#F3C894]'
                >
                  <option value=''>select</option>
                  {BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#C9720E]'>
                  ▾
                </span>
              </div>
              <input
                type='text'
                value={form.accountNumber}
                onChange={(e) =>
                  handleInputChange('accountNumber', e.target.value)
                }
                placeholder='Enter no. bank account'
                className='flex-1 rounded-2xl border-2 border-[#E29B4C] bg-white px-4 py-2 text-base text-[#1F1308] shadow-[0_6px_14px_rgba(0,0,0,0.18)] outline-none transition focus:ring-2 focus:ring-[#F3C894]'
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm uppercase tracking-[0.25em] text-white/85'>
              Enter amount money
            </label>
            <input
              type='number'
              min='1'
              value={form.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder='Enter amount money'
              className='rounded-2xl border-2 border-[#E29B4C] bg-white px-4 py-2 text-base text-[#1F1308] shadow-[0_6px_14px_rgba(0,0,0,0.18)] outline-none transition focus:ring-2 focus:ring-[#F3C894]'
            />
          </div>

          {isPasswordStep && (
            <div className='flex flex-col gap-2'>
              <label className='text-sm uppercase tracking-[0.25em] text-white/85'>
                Account password
              </label>
              <input
                type='password'
                value={form.password}
                onChange={(e) =>
                  handleInputChange('password', e.target.value)
                }
                placeholder='Enter your account password'
                className='rounded-2xl border-2 border-[#E29B4C] bg-white px-4 py-2 text-base text-[#1F1308] shadow-[0_6px_14px_rgba(0,0,0,0.18)] outline-none transition focus:ring-2 focus:ring-[#F3C894]'
              />
            </div>
          )}
        </div>

        {message && (
          <div
            className={classNames(
              'rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-center text-base font-semibold text-[#1F1308] shadow-[0_10px_25px_rgba(0,0,0,0.25)]',
              message.type === 'success' && 'text-[#14532d]',
              message.type === 'error' && 'text-[#9f1239]'
            )}
          >
            {message.text}
          </div>
        )}

        <div className='mt-4 flex flex-col gap-4 text-lg font-semibold md:flex-row justify-center'>
          <button
            type='submit'
            className='rounded-full bg-gradient-to-b from-[#F3A33D] to-[#B86414] px-10 py-3 text-white shadow-[0_20px_30px_rgba(0,0,0,0.35)] transition hover:translate-y-[1px] hover:brightness-110'
          >
            {isPasswordStep ? 'Confirm' : 'Top Up'}
          </button>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full bg-gradient-to-b from-[#F8F8F8] to-[#9F9F9F] px-10 py-3 text-[#2F2F2F] shadow-[0_12px_20px_rgba(0,0,0,0.25)] transition hover:translate-y-[1px] hover:brightness-110'
          >
            Back
          </button>
        </div>
      </form>
    </Modal>
  );
}

function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}