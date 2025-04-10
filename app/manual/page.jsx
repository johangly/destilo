"use client"

import Container from '@/components/Container'
import BackButton from '@/components/BackButton'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter()
  return (
    <Container className='flex-row items-start pt-5'>
      <div className='flex items-center justify-center px-6'>
        <BackButton
          text='Volver'
          iconSrc='/backIcon.svg'
          href='/'
        />
      </div>  
      <div className="w-full max-w-[1200px]">
        <object data="/manual.pdf" type="application/pdf" width="100%" height="800px"></object>
      </div>
    </Container>
  )
}
