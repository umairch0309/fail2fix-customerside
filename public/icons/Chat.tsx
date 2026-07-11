import React from 'react'

interface ChatProps {
  className?: string;
  color?: string;
}

const Chat = ({ className, color = "#494F57" }: ChatProps) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18.3333 8.75V12.9167C18.3333 15.8333 16.6667 17.0833 14.1667 17.0833H5.83333C3.33333 17.0833 1.66667 15.8333 1.66667 12.9167V7.08333C1.66667 4.16667 3.33333 2.91667 5.83333 2.91667H11.6667" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.83333 7.5L8.4417 9.58333C9.3 10.2667 10.7083 10.2667 11.5667 9.58333L12.55 8.8" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.25 6.66667C17.4006 6.66667 18.3333 5.73393 18.3333 4.58333C18.3333 3.43274 17.4006 2.5 16.25 2.5C15.0994 2.5 14.1667 3.43274 14.1667 4.58333C14.1667 5.73393 15.0994 6.66667 16.25 6.66667Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Chat
