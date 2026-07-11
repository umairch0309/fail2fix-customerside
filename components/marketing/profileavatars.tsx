import { cn } from '@/lib/utils'
import Image, { StaticImageData } from 'next/image';
import React from 'react'

interface Props {
  className?: string;
  src: string | StaticImageData;
  key:string |number;
  text?:string|number;
}
const Profileavatars = ({className, src ,key ,text}:Props) => {
  return (
    <div key={key} className={cn('w-[38px] h-[38px] rounded-full overflow-hidden border-3 border-white relative flex items-center justify-center',className)}>
        <Image  src={src} alt='' fill className='w-full h-full object-cover absolute -z-50'/>
        <div className='text-white z-100'>{text}</div>
    </div>
  )
}

export default Profileavatars