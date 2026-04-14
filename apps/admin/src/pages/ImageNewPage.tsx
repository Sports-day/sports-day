import { useNavigate } from 'react-router-dom'
import { ImageCreatePage } from '@/features/images'

export default function ImageNewPage() {
  const navigate = useNavigate()
  return <ImageCreatePage onBack={() => navigate('/images')} />
}
