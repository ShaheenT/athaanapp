import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Upload, MapPin, Plus } from "lucide-react";
import UploadPrayerTimesModal from "@/components/modals/upload-prayer-times-modal";
import AddPrayerTimeModal from "@/components/modals/add-prayer-time-modal";
import { format } from "date-fns";
import PrayerCalculator from "@/components/prayer-calculator";

export default function PrayerTimes() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddPrayerModalOpen, setIsAddPrayerModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ["/api/prayer-times", selectedDate],
  });

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const getSourceBadge = (source: string) => {
    const variants = {
      manual: "default",
      aladhan: "secondary",
      local_calc: "outline"
    } as const;
    
    return (
      <Badge variant={variants[source as keyof typeof variants] || "outline"}>
        {source}
      </Badge>
    );
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
                <h1 className="text-2xl font-semibold text-gray-900">Prayer Times Management</h1>
                <p className="text-sm text-gray-500">Manage daily prayer schedules for all locations</p>
              </div>
              <div className="flex items-center space-x-2">
                <AddPrayerTimeModal open={isAddPrayerModalOpen} onOpenChange={setIsAddPrayerModalOpen}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prayer Time
                  </Button>
                </AddPrayerTimeModal>
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Prayer Times
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Date Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
                <div className="text-sm text-gray-600">
                  Showing prayer times for {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Fajr</h3>
                  <p className="text-sm text-gray-600">Dawn Prayer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-yellow-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Dhuhr</h3>
                  <p className="text-sm text-gray-600">Noon Prayer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Asr</h3>
                  <p className="text-sm text-gray-600">Afternoon Prayer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-red-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Maghrib</h3>
                  <p className="text-sm text-gray-600">Sunset Prayer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Isha</h3>
                  <p className="text-sm text-gray-600">Night Prayer</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prayer Time Calculator */}
          <PrayerCalculator />

          {/* Prayer Times Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Prayer Times by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading prayer times...</div>
              ) : !prayerTimes?.length ? (
                <div className="text-center py-8 text-gray-500">
                  No prayer times found for the selected date.
                  <br />
                  <Button 
                    variant="link" 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-2"
                  >
                    Upload prayer times for this date
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Fajr</TableHead>
                        <TableHead>Dhuhr</TableHead>
                        <TableHead>Asr</TableHead>
                        <TableHead>Maghrib</TableHead>
                        <TableHead>Isha</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prayerTimes.map((times: any) => (
                        <TableRow key={times.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {times.locationName}
                            </div>
                          </TableCell>
                          <TableCell>{formatTime(times.fajr)}</TableCell>
                          <TableCell>{formatTime(times.dhuhr)}</TableCell>
                          <TableCell>{formatTime(times.asr)}</TableCell>
                          <TableCell>{formatTime(times.maghrib)}</TableCell>
                          <TableCell>{formatTime(times.isha)}</TableCell>
                          <TableCell>{getSourceBadge(times.source)}</TableCell>
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

      <UploadPrayerTimesModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}
