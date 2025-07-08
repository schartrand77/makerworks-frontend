import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  to: string
  className?: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  to,
  className = '',
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    console.debug(`[DashboardCard] Navigating to ${to}`)
    navigate(to)
  }

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
    >
      <CardContent className="flex flex-col items-center p-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}

export default DashboardCard