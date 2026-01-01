import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Wifi, Volume2, Play, RefreshCw, Settings, Zap } from "lucide-react";

export default function DeviceControlPanel() {
  const [selectedLocation, setSelectedLocation] = useState('Cape Town');
  const { toast } = useToast();

  // Get connected devices
  const { data: devices, isLoading } = useQuery({
    queryKey: ['/api/devices'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Send command to device
  const sendCommandMutation = useMutation({
    mutationFn: async ({ deviceId, command, data }: { deviceId: string; command: string; data?: any }) => {
      const response = await apiRequest('POST', '/api/devices/send-command', {
        deviceId,
        command,
        data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Command sent",
        description: "Command successfully sent to device",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Command failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update prayer times on all devices
  const updatePrayerTimesMutation = useMutation({
    mutationFn: async (location: string) => {
      const response = await apiRequest('POST', '/api/devices/update-prayer-times', {
        location
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Prayer times updated",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSendCommand = (deviceId: string, command: string, data?: any) => {
    sendCommandMutation.mutate({ deviceId, command, data });
  };

  const handleUpdatePrayerTimes = () => {
    updatePrayerTimesMutation.mutate(selectedLocation);
  };

  const getStatusBadge = (device: any) => {
    if (device.isConnected) {
      return <Badge className="bg-green-500">Connected</Badge>;
    } else if (device.isOnline) {
      return <Badge variant="secondary">Offline</Badge>;
    } else {
      return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading devices...</div>
        </CardContent>
      </Card>
    );
  }

  const connectedDevices = devices?.filter((device: any) => device.isConnected) || [];

  return (
    <div className="space-y-6">
      {/* Prayer Time Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Prayer Time Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cape Town">Cape Town</SelectItem>
                  <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="Durban">Durban</SelectItem>
                  <SelectItem value="Pretoria">Pretoria</SelectItem>
                  <SelectItem value="Port Elizabeth">Port Elizabeth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-end">
              <Button
                onClick={handleUpdatePrayerTimes}
                disabled={updatePrayerTimesMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {updatePrayerTimesMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Update All Devices
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Send current prayer times to all connected devices
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            Connected Devices ({connectedDevices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectedDevices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No devices currently connected
            </div>
          ) : (
            <div className="space-y-4">
              {connectedDevices.map((device: any) => (
                <div key={device.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Device {device.serialNumber}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {device.location || 'No location set'}
                      </p>
                    </div>
                    {getStatusBadge(device)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendCommand(device.serialNumber, 'audio_test')}
                      disabled={sendCommandMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Test Audio
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendCommand(device.serialNumber, 'volume_update', { volume: 75 })}
                      disabled={sendCommandMutation.isPending}
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      Set Volume
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendCommand(device.serialNumber, 'remote_maintenance')}
                      disabled={sendCommandMutation.isPending}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Maintenance
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendCommand(device.serialNumber, 'prayer_times_update')}
                      disabled={sendCommandMutation.isPending}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sync Times
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Devices Status */}
      <Card>
        <CardHeader>
          <CardTitle>All Registered Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {devices?.map((device: any) => (
              <div key={device.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${device.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="font-medium">Device {device.serialNumber}</div>
                    <div className="text-sm text-gray-600">{device.location || 'No location'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(device)}
                  {device.lastSeen && (
                    <span className="text-xs text-gray-500">
                      Last seen: {new Date(device.lastSeen).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}