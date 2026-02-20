
import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-lg font-bold">
      <div className="relative h-8 w-8">
         <Image 
           src="/Gemini_Generated_Image_hj5p24hj5p24hj5p.png" 
           alt="TutorLink Logo" 
           fill
           sizes="32px"
           className="object-contain"
         />
      </div>
      <span>TutorLink</span>
    </Link>
  );
}