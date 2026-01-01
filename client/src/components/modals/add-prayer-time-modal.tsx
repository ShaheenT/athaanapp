import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddPrayerTimeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function AddPrayerTimeModal({ open, onOpenChange, children }: AddPrayerTimeModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: "",
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
    source: "manual"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('firebaseToken');
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add prayer time');

      toast({
        title: "Prayer Time Added",
        description: `Prayer times for ${formData.location} on ${formData.date} have been added`
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: "",
        fajr: "",
        dhuhr: "",
        asr: "",
        maghrib: "",
        isha: "",
        source: "manual"
      });
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Prayer Time</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Cape Town, Johannesburg"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prayer Times</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fajr" className="text-sm">Fajr</Label>
                <Input
                  id="fajr"
                  type="time"
                  value={formData.fajr}
                  onChange={(e) => setFormData({ ...formData, fajr: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dhuhr" className="text-sm">Dhuhr</Label>
                <Input
                  id="dhuhr"
                  type="time"
                  value={formData.dhuhr}
                  onChange={(e) => setFormData({ ...formData, dhuhr: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="asr" className="text-sm">Asr</Label>
                <Input
                  id="asr"
                  type="time"
                  value={formData.asr}
                  onChange={(e) => setFormData({ ...formData, asr: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maghrib" className="text-sm">Maghrib</Label>
                <Input
                  id="maghrib"
                  type="time"
                  value={formData.maghrib}
                  onChange={(e) => setFormData({ ...formData, maghrib: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="isha" className="text-sm">Isha</Label>
                <Input
                  id="isha"
                  type="time"
                  value={formData.isha}
                  onChange={(e) => setFormData({ ...formData, isha: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Entry</SelectItem>
                <SelectItem value="aladhan">Aladhan API</SelectItem>
                <SelectItem value="local_calc">Local Calculation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Prayer Time"}
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
