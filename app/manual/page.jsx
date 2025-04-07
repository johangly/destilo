import Container from '@/components/Container'

export default function page() {
  return (
    <Container>
      <div className="w-full max-w-[1200px]">
        <object data="/manual.pdf" type="application/pdf" width="100%" height="800px"></object>
      </div>
    </Container>
  )
}
