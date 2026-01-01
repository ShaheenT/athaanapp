import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import RecentActivity from "@/components/recent-activity";
import PrayerTimesCard from "@/components/prayer-times-card";
import DeviceStatusTable from "@/components/device-status-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Upload, Settings, BarChart3 } from "lucide-react";
import AddUserModal from "@/components/modals/add-user-modal";
import UploadPrayerTimesModal from "@/components/modals/upload-prayer-times-modal";

export default function AdminDashboard() {
  const [language, setLanguage] = useState("en");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Welcome back, manage your Athaan system</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Notification Bell */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full"></span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <StatsCards stats={dashboardStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            
            {/* Today's Prayer Times */}
            <div>
              <PrayerTimesCard />
            </div>
          </div>

          {/* Device Status Table */}
          <div className="mt-8">
            <DeviceStatusTable />
          </div>

          {/* Quick Actions Panel */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 justify-start"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Add User</h4>
                  <p className="text-sm text-gray-500">Create new account</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 justify-start"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Times</h4>
                  <p className="text-sm text-gray-500">Import prayer schedule</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 justify-start"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Settings</h4>
                  <p className="text-sm text-gray-500">System configuration</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 justify-start"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Reports</h4>
                  <p className="text-sm text-gray-500">Generate analytics</p>
                </div>
              </div>
            </Button>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
      />
      <UploadPrayerTimesModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}
