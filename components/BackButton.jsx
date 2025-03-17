import Link from 'next/link'
import Image from 'next/image'
import './backButton.css'

const BackButton = ({ href = '/home', text = 'Ir a inicio', iconSrc = '/backIcon.svg', style = {}, imageSize = 20 }) => {
  return (
    <div className="hideOnPrint">
        <Link
        href={href}
        style={{ display: 'flex', alignItems: 'center', ...style }}
        >
            <Image src={iconSrc} alt='back' width={imageSize} height={imageSize} />
            <p style={{ marginLeft: '10px' }}>{text}</p>
        </Link>
    </div>
  )
}

export default BackButton