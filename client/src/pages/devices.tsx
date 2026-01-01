import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Wifi, WifiOff, Volume2, RefreshCw, Search, User, MapPin, Wrench, Clock, Settings, Plus } from "lucide-react";
import DeviceControlPanel from "@/components/device-control-panel";
import AddDeviceModal from "@/components/modals/add-device-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devicesWithCustomers, isLoading } = useQuery({
    queryKey: ["/api/devices/with-customers"],
  });

  const updateDeviceStatusMutation = useMutation({
    mutationFn: async ({ deviceId, status }: { deviceId: number; status: string }) => {
      await apiRequest("PUT", `/api/devices/${deviceId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices/with-customers"] });
      toast({
        title: "Success",
        description: "Device status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update device status",
        variant: "destructive",
      });
    },
  });

  const filteredDevices = Array.isArray(devicesWithCustomers) ? devicesWithCustomers.filter((device: any) =>
    device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleUpdateDeviceStatus = (deviceId: number, status: string) => {
    updateDeviceStatusMutation.mutate({ deviceId, status });
  };

  const openDeviceModal = (device: any) => {
    setSelectedDevice(device);
    setIsDeviceModalOpen(true);
  };

  const getStatusBadge = (status: string, isOnline: boolean) => {
    if (status === "maintenance") {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
    }
    return isOnline ? 
      <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge> : 
      <Badge variant="destructive">Offline</Badge>;
  };

  const getStatusIcon = (status: string, isOnline: boolean) => {
    if (status === "maintenance") {
      return <Wrench className="w-4 h-4 text-yellow-600" />;
    }
    return isOnline ? 
      <Wifi className="w-4 h-4 text-green-600" /> : 
      <WifiOff className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Device Management</h1>
                <p className="text-sm text-gray-500">Monitor and control Raspberry Pi devices</p>
              </div>
              <div className="flex items-center space-x-4">
                <AddDeviceModal open={isAddDeviceModalOpen} onOpenChange={setIsAddDeviceModalOpen}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Device
                  </Button>
                </AddDeviceModal>
                <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Offline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
              </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Devices</p>
                    <p className="text-2xl font-bold text-gray-900">{devicesWithCustomers?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Wifi className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Online</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {devicesWithCustomers?.filter((d: any) => d.isOnline).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <WifiOff className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Offline</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {devicesWithCustomers?.filter((d: any) => !d.isOnline).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {devicesWithCustomers?.filter((d: any) => d.status === "maintenance").length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Control Panel */}
          <DeviceControlPanel />

          {/* Devices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Device Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading devices...</div>
              ) : !filteredDevices?.length ? (
                <div className="text-center py-8 text-gray-500">No devices found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.map((device: any) => (
                        <TableRow key={device._id || device.deviceId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(device.isOnline)}
                              <span>{device.serialNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {device.customer ? (
                              <div>
                                <div className="font-medium">{device.customer.fullName}</div>
                                <div className="text-sm text-gray-500">{device.customer.membershipId}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>{device.locationName || "Not set"}</TableCell>
                          <TableCell>
                            {getStatusBadge(device.status, device.isOnline)}
                          </TableCell>
                          <TableCell>
                            {device.lastSeen 
                              ? formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Volume2 className="w-4 h-4" />
                              <span className="text-sm">{device.audioVolume || 75}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeviceModal(device)}
                              >
                                Manage
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
