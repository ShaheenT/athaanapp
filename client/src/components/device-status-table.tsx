import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function DeviceStatusTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ["/api/devices"],
  });

  const simulateDeviceMutation = useMutation({
    mutationFn: async ({ action, deviceId }: { action: string; deviceId: number }) => {
      await apiRequest("POST", `/api/simulate/device/${action}`, { deviceId });
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Device ${action} simulation completed`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to simulate device action",
        variant: "destructive",
      });
    },
  });

  const handleSimulateDevice = (deviceId: number, action: string) => {
    simulateDeviceMutation.mutate({ action, deviceId });
  };

  const getStatusBadge = (status: string, isOnline: boolean) => {
    if (status === "maintenance") {
      return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
    }
    return isOnline ? (
      <Badge className="bg-green-100 text-green-800">Online</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Offline</Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading devices...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Device Status Overview</CardTitle>
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
      </CardHeader>
      <CardContent>
        {!devices?.length ? (
          <div className="text-center py-8 text-gray-500">
            No devices found. Add devices to monitor their status.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.slice(0, 5).map((device: any) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.serialNumber}</TableCell>
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
                      <TableCell>{device.volumeLevel}%</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSimulateDevice(device.id, device.isOnline ? "offline" : "online")}
                            disabled={simulateDeviceMutation.isPending}
                          >
                            {device.isOnline ? "Simulate Offline" : "Simulate Online"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing 1 to {Math.min(5, devices.length)} of {devices.length} devices
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={devices.length <= 5}
                    onClick={() => window.location.href = '/devices'}
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
