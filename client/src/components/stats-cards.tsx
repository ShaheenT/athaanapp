import { Card, CardContent } from "@/components/ui/card";
import { Users, Monitor, Clock, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalUsers: number;
    activeDevices: number;
    totalDevices: number;
    nextPrayer: { name: string; time: string } | null;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats?.totalUsers || 0}</h3>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+5.2%</span>
            <span className="text-gray-500 text-sm"> from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Devices Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats?.activeDevices || 0}</h3>
              <p className="text-sm text-gray-500">Active Devices</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">98.7%</span>
            <span className="text-gray-500 text-sm"> uptime</span>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Times Today Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Next: {stats?.nextPrayer?.name || "Dhuhr"}
              </h3>
              <p className="text-sm text-gray-500">{stats?.nextPrayer?.time || "12:45 PM"}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-primary-600 text-sm font-medium">in 2h 15m</span>
          </div>
        </CardContent>
      </Card>

      {/* System Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">All Systems</h3>
              <p className="text-sm text-green-600 font-medium">Operational</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">Last updated: 2 min ago</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
