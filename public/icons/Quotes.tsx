import React from 'react'

interface QuotesProps {
  className?: string;
  color?: string;
}

const Quotes = ({ className, color = "#81868C" }: QuotesProps) => {
  return (
   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M5.60964 16.4166C6.29297 15.6833 7.33464 15.7416 7.93464 16.5416L8.7763 17.6666C9.4513 18.5583 10.543 18.5583 11.218 17.6666L12.0596 16.5416C12.6596 15.7416 13.7013 15.6833 14.3846 16.4166C15.868 18 17.0763 17.475 17.0763 15.2583V5.86663C17.0846 2.50829 16.3013 1.66663 13.1513 1.66663H6.8513C3.7013 1.66663 2.91797 2.50829 2.91797 5.86663V15.25C2.91797 17.475 4.13464 17.9916 5.60964 16.4166Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.66797 5.83337H13.3346" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.5 9.16663H12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

  )
}

export default Quotes
