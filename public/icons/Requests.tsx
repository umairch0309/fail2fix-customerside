import React from 'react'

interface RequestsProps {
  className?: string;
  color?: string;
}

const Requests = ({ className, color = "#81868C" }: RequestsProps) => {
  return (
 <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M10.099 10.65C10.0406 10.6417 9.96562 10.6417 9.89896 10.65C8.43229 10.6 7.26562 9.39998 7.26562 7.92498C7.26562 6.41665 8.48229 5.19165 9.99896 5.19165C11.5073 5.19165 12.7323 6.41665 12.7323 7.92498C12.724 9.39998 11.5656 10.6 10.099 10.65Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10.0013 1.66663C5.39893 1.66663 1.66797 5.39759 1.66797 9.99996C1.66797 12.4369 2.71708 14.6262 4.38464 16.15C4.46797 15.3666 4.96797 14.6 5.85964 14C8.14297 12.4833 11.8763 12.4833 14.143 14C15.0346 14.6 15.5346 15.3666 15.618 16.15C17.2855 14.6262 18.3346 12.4369 18.3346 9.99996C18.3346 5.39759 14.6037 1.66663 10.0013 1.66663Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.5406 20.2458L11.4531 22.3375" stroke={color} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.45703 20.2458H13.5404" stroke={color} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.45703 17.7541L8.54453 15.6625" stroke={color} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.5404 17.7542L10.8752 17.7542L6.45703 17.7542" stroke={color} strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

  )
}

export default Requests
