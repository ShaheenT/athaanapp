import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
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
  Settings,
  Home,
  Calendar,
  Headphones,
  Phone
} from "lucide-react";

export default function DemoDashboard() {
  // Mock data for demonstration
  const stats = {
    totalUsers: 48,
    activeDevices: 12,
    totalDevices: 15,
    nextPrayer: { name: "Maghrib", time: "6:42 PM" }
  };

  const recentCustomers = [
    { id: 1, fullName: "Ahmed Hassan", accountEnabled: true },
    { id: 2, fullName: "Fatima Al-Zahra", accountEnabled: true },
    { id: 3, fullName: "Omar Abdullah", accountEnabled: false },
    { id: 4, fullName: "Aisha Ibrahim", accountEnabled: true },
    { id: 5, fullName: "Mohammed Ali", accountEnabled: true }
  ];

  const recentDevices = [
    { id: 1, isOnline: true, customer: { fullName: "Ahmed Hassan", membershipId: "MEM001" } },
    { id: 2, isOnline: false, customer: { fullName: "Fatima Al-Zahra", membershipId: "MEM002" } },
    { id: 3, isOnline: true, customer: { fullName: "Omar Abdullah", membershipId: "MEM003" } },
    { id: 4, isOnline: true, customer: null },
    { id: 5, isOnline: false, customer: { fullName: "Aisha Ibrahim", membershipId: "MEM004" } }
  ];

  const prayerTimes = {
    fajrTime: "5:15 AM",
    dhuhrTime: "12:30 PM", 
    asrTime: "3:45 PM",
    maghribTime: "6:42 PM",
    ishaTime: "8:15 PM"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vertical Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">☪</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Athaan Fi Beit</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link href="/demo">
              <div className="flex items-center px-3 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200">
                <Home className="w-5 h-5 mr-3" />
                <span className="font-medium">Dashboard</span>
              </div>
            </Link>
            
            <Link href="/demo/users">
              <div className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Users className="w-5 h-5 mr-3" />
                <span>Users</span>
              </div>
            </Link>
            
            <Link href="/demo/devices">
              <div className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Monitor className="w-5 h-5 mr-3" />
                <span>Devices</span>
              </div>
            </Link>
            
            <Link href="/demo/prayer-times">
              <div className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Clock className="w-5 h-5 mr-3" />
                <span>Prayer Times</span>
              </div>
            </Link>
            
            <Link href="/demo/audio-profiles">
              <div className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Volume2 className="w-5 h-5 mr-3" />
                <span>Audio Profiles</span>
              </div>
            </Link>
            
            <Link href="/demo/technicians">
              <div className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Wrench className="w-5 h-5 mr-3" />
                <span>Technicians</span>
              </div>
            </Link>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Settings className="w-4 h-4 mr-2" />
              <span>System Settings</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
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
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.activeDevices}</p>
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
                    <p className="text-lg font-bold text-gray-900">{stats.nextPrayer.name}</p>
                    <p className="text-sm text-gray-500">{stats.nextPrayer.time}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDevices}</p>
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
                    {recentCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium truncate">{customer.fullName}</span>
                        </div>
                        <Badge variant={customer.accountEnabled ? "default" : "secondary"} className="text-xs">
                          {customer.accountEnabled ? "Active" : "Disabled"}
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
                    {recentDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium">DEV-{device.id.toString().padStart(4, '0')}</span>
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fajr</span>
                      <span className="text-sm text-gray-600">{prayerTimes.fajrTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Dhuhr</span>
                      <span className="text-sm text-gray-600">{prayerTimes.dhuhrTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Asr</span>
                      <span className="text-sm text-gray-600">{prayerTimes.asrTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Maghrib</span>
                      <span className="text-sm text-gray-600">{prayerTimes.maghribTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Isha</span>
                      <span className="text-sm text-gray-600">{prayerTimes.ishaTime}</span>
                    </div>
                  </div>
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