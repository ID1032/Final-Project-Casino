import Link from 'next/link';
import Image from 'next/image';
import { SectionModes } from './select-mode';
import Home from '@/app/home/assets/home.svg';

export default function Navbar() {
  return (
    <div className='flex items-center '>
      <Link
        href='/'
        className='absolute top-[1vw] left-[1vw] p-2 w-[4vw] h-[4vw] max-w-[50px] max-h-[50px]'
      >
        <Image
          src={Home}
          alt='Home'
          fill
          className='cursor-pointer hover:scale-110 transition-transform duration-200'
        />
      </Link>
      <SectionModes />
       <Link
        href='/'
        className='absolute top-[1vw] right-[1vw] p-2 w-[4vw] h-[4vw] max-w-[50px] max-h-[50px]'
      >

      </Link>
    </div>
  );
}

