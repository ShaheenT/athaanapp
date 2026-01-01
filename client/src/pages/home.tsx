import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Monitor, 
  Clock, 
  Volume2, 
  Wrench, 
  TrendingUp,
  Wifi,
  WifiOff,
  User,
  ArrowUpRight,
  Calendar,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentDevices } = useQuery({
    queryKey: ["/api/devices/with-customers"],
    select: (data) => Array.isArray(data) ? data.slice(0, 5) : []
  });

  const { data: recentCustomers } = useQuery({
    queryKey: ["/api/customers"],
    select: (data) => Array.isArray(data) ? data.slice(0, 5) : []
  });

  const { data: nextPrayerTimes } = useQuery({
    queryKey: ["/api/prayer-times/today"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Athaan Fi Beit Admin Panel</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Devices</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeDevices || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Next Prayer</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stats?.nextPrayer?.name || "Loading..."}
                    </p>
                    <p className="text-sm text-gray-500">
                      {stats?.nextPrayer?.time || ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Devices</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalDevices || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Users Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">User Management</CardTitle>
                <Link href="/users">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Manage customer profiles</span>
                  </div>
                  <div className="space-y-2">
                    {recentCustomers?.map((customer: any) => (
                      <div key={customer._id || customer.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium truncate">{customer.fullName}</span>
                        </div>
                        <Badge variant={customer.accountEnabled !== false ? "default" : "secondary"} className="text-xs">
                          {customer.accountEnabled !== false ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Link href="/users">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Devices Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Device Status</CardTitle>
                <Link href="/devices">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Monitor device connections</span>
                  </div>
                  <div className="space-y-2">
                    {recentDevices?.map((device: any) => (
                      <div key={device._id || device.deviceId} className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium">{device.deviceId || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {device.isOnline ? (
                            <Wifi className="w-3 h-3 text-green-600" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-red-600" />
                          )}
                          <Badge variant={device.isOnline ? "default" : "destructive"} className="text-xs">
                            {device.isOnline ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/devices">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Devices
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Prayer Times Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Prayer Times</CardTitle>
                <Link href="/prayer-times">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Today's prayer schedule</span>
                  </div>
                  {nextPrayerTimes ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Fajr</span>
                        <span className="text-sm text-gray-600">{nextPrayerTimes.fajrTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Dhuhr</span>
                        <span className="text-sm text-gray-600">{nextPrayerTimes.dhuhrTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Asr</span>
                        <span className="text-sm text-gray-600">{nextPrayerTimes.asrTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Maghrib</span>
                        <span className="text-sm text-gray-600">{nextPrayerTimes.maghribTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Isha</span>
                        <span className="text-sm text-gray-600">{nextPrayerTimes.ishaTime}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Loading prayer times...</div>
                  )}
                  <Link href="/prayer-times">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Prayer Times
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Audio Profiles Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Audio Profiles</CardTitle>
                <Link href="/audio-profiles">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Manage Athaan audio files</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Volume</p>
                      <p className="text-lg font-bold text-gray-900">75%</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Active</p>
                      <p className="text-lg font-bold text-gray-900">3</p>
                    </div>
                  </div>
                  <Link href="/audio-profiles">
                    <Button variant="outline" size="sm" className="w-full">
                      Audio Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Technicians Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Technicians</CardTitle>
                <Link href="/technicians">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Installation team</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="text-lg font-bold text-gray-900">2</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">On Site</p>
                      <p className="text-lg font-bold text-gray-900">1</p>
                    </div>
                  </div>
                  <Link href="/technicians">
                    <Button variant="outline" size="sm" className="w-full">
                      View Technicians
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* System Settings Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">System Settings</CardTitle>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Configuration & logs</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Status</span>
                      <Badge variant="default" className="text-xs">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}