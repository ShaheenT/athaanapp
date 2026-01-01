import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function AddDeviceModal({ open, onOpenChange, children }: AddDeviceModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: "",
    location: "",
    deviceType: "speaker",
    firmware: "1.0.0",
    assignedUser: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('firebaseToken');
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create device');

      toast({
        title: "Device Added",
        description: `Device ${formData.serialNumber} has been added successfully`
      });

      setFormData({ serialNumber: "", location: "", deviceType: "speaker", firmware: "1.0.0", assignedUser: "" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              placeholder="e.g., DEV-0001"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Living Room, Mosque"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceType">Device Type</Label>
            <Select value={formData.deviceType} onValueChange={(value) => setFormData({ ...formData, deviceType: value })}>
              <SelectTrigger id="deviceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speaker">Speaker</SelectItem>
                <SelectItem value="amplifier">Amplifier</SelectItem>
                <SelectItem value="receiver">Receiver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firmware">Firmware Version</Label>
            <Input
              id="firmware"
              placeholder="e.g., 1.0.0"
              value={formData.firmware}
              onChange={(e) => setFormData({ ...formData, firmware: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedUser">Assign to User</Label>
            <Input
              id="assignedUser"
              placeholder="Enter user ID (optional)"
              value={formData.assignedUser}
              onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Device"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
