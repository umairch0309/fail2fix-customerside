import React from 'react'

interface NotificationProps {
  className?: string;
  color?: string;
  indicatorColor?: string;
  showIndicator?: boolean;
}

const Notification = ({ className, color = "#737A82", indicatorColor = "#F15D1E", showIndicator = false }: NotificationProps) => {
  return (
   <svg width="20" height="22" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M11.5193 5.24268C8.34723 5.24268 5.76931 7.82059 5.76931 10.9927V13.7623C5.76931 14.3468 5.52015 15.2381 5.22306 15.7364L4.12098 17.5668C3.44056 18.6977 3.91015 19.9531 5.15598 20.3748C9.2864 21.7548 13.7426 21.7548 17.8731 20.3748C19.0326 19.9914 19.5406 18.621 18.9081 17.5668L17.806 15.7364C17.5185 15.2381 17.2693 14.3468 17.2693 13.7623V10.9927C17.2693 7.83018 14.6818 5.24268 11.5193 5.24268Z" stroke={color} strokeWidth="1.4375" strokeMiterlimit="10" strokeLinecap="round"/>
<path d="M13.2958 5.52073C12.9987 5.43448 12.6921 5.3674 12.3758 5.32907C11.4558 5.21407 10.5742 5.28115 9.75 5.52073C10.0279 4.81157 10.7179 4.31323 11.5229 4.31323C12.3279 4.31323 13.0179 4.81157 13.2958 5.52073Z" stroke={color} strokeWidth="1.4375" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.3945 20.72C14.3945 22.3012 13.1008 23.595 11.5195 23.595C10.7337 23.595 10.0054 23.2691 9.48786 22.7516C8.97036 22.2341 8.64453 21.5058 8.64453 20.72" stroke={color} strokeWidth="1.4375" strokeMiterlimit="10"/>
{showIndicator && <circle cx="16.5" cy="4.5" r="4" fill={indicatorColor} stroke="#F5F5F5"/>}
</svg>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  )
}

export default Notification