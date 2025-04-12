import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <>
      <Image src='/navbar-icon.svg' className="dark:hidden block print:block" alt='logo' width={180} height={50} />
      <Image src='/logoDarkMode.svg' className="hidden dark:block print:hidden" alt='logo' width={180} height={50}/>
    </>
          
  );
};

export default Logo;