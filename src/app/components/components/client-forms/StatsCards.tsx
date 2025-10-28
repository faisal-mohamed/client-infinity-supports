"use client";

import { FaFileAlt, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

interface StatsCardsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: 'Total Forms',
      value: stats.total,
      icon: FaFileAlt,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: FaClock,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Not Started',
      value: stats.notStarted,
      icon: FaExclamationTriangle,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
