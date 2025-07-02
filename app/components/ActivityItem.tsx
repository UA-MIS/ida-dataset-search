interface ActivityItemProps {
  message: React.ReactNode;
  timestamp: string;
  color: "green" | "blue" | "yellow" | "red" | "gray" | "purple";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const colorMap = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
  purple: "bg-purple-500",
};

const ActivityItem = ({
  message,
  timestamp,
  color,
  icon,
  onClick,
  className = "",
}: ActivityItemProps) => {
  return (
    <div
      className={`flex items-center space-x-4 group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {icon ? (
        <div className="flex-shrink-0">{icon}</div>
      ) : (
        <div
          className={`w-2 h-2 rounded-full ${colorMap[color]} flex-shrink-0`}
        />
      )}
      <div className="flex-grow group-hover:text-gray-900 transition-colors">
        {message}
      </div>
      <span className="text-sm text-gray-500 flex-shrink-0">{timestamp}</span>
    </div>
  );
};

export default ActivityItem;
