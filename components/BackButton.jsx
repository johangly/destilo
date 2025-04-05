import Link from 'next/link'
import Image from 'next/image'
import './backButton.css'

const BackButton = ({ href = '/home', text = 'Ir a inicio', iconSrc = '/backIcon.svg', style = {}, imageSize = 20,className="" }) => {
  return (
    <div className="hideOnPrint">
        <Link
        href={href}
        className={className}
        style={{ display: 'flex', alignItems: 'center', ...style }}
        >
            <Image src={iconSrc} alt='back' className="dark:invert" width={imageSize} height={imageSize} />
            <p style={{ marginLeft: '10px' }} className="text-slate-800 dark:text-slate-100">{text}</p>
        </Link>
    </div>
  )
}

export default BackButton