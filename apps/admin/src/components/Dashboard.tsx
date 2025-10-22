import { useState, useEffect } from 'react';
import { Activity, Bot, Mic, Clock, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
  totalActivities: number;
  successfulActivities: number;
  failedActivities: number;
  successRate: number;
  activeKeywords: number;
  recentActivities: number;
  isRunning: boolean;
  voiceEnabled: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/activities/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netia-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Success Rate',
      value: `${Math.round((stats?.successRate || 0) * 100) / 100}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Active Keywords',
      value: stats?.activeKeywords || 0,
      icon: Bot,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive',
    },
    {
      title: 'Recent (24h)',
      value: stats?.recentActivities || 0,
      icon: Clock,
      color: 'bg-orange-500',
      change: '+8',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your Netia Reddit Bot performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            stats?.isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {stats?.isRunning ? '🟢 Bot Running' : '🔴 Bot Stopped'}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            stats?.voiceEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            🎤 Voice {stats?.voiceEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center">
            <Bot className="h-4 w-4 mr-2" />
            Add Keyword Rule
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Activity className="h-4 w-4 mr-2" />
            View Activities
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Mic className="h-4 w-4 mr-2" />
            Voice Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats?.recentActivities === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">The bot will show recent interactions here</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Bot interactions in the last 24 hours</span>
                <span className="font-medium">{stats?.recentActivities}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Successful responses</span>
                <span className="font-medium text-green-600">{stats?.successfulActivities}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Failed responses</span>
                <span className="font-medium text-red-600">{stats?.failedActivities}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Features Status */}
      {stats?.voiceEnabled && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Voice Reception Active</h3>
              <p className="text-blue-700">
                Netia can now process voice messages and respond with natural speech. 
                Users can have voice conversations directly on Reddit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

