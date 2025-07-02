interface StatCardProps {
  title: string;
  value: number | string;
  className?: string;
}

const StatCard = ({ title, value, className = "" }: StatCardProps) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-red-800">{value}</p>
    </div>
  );
};

export default StatCard;
