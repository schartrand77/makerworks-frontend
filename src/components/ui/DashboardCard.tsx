import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

type DashboardCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  to?: string;
  className?: string;
};

const DashboardCard = ({
  title,
  description,
  icon,
  to = '/dashboard',
  className = '',
}: DashboardCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
    >
      <CardContent className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;