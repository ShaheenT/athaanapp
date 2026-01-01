import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function PrayerTimesCard() {
  const { data: todaysPrayerTimes } = useQuery({
    queryKey: ["/api/prayer-times/today/Cape Town"],
  });

  const prayerNames = [
    { name: "Fajr", key: "fajr" },
    { name: "Dhuhr", key: "dhuhr" },
    { name: "Asr", key: "asr" },
    { name: "Maghrib", key: "maghrib" },
    { name: "Isha", key: "isha" },
  ];

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

  const getCurrentTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    if (!todaysPrayerTimes) return "Dhuhr";

    // Convert prayer times to minutes for comparison
    const prayerMinutes = prayerNames.map(prayer => {
      const timeStr = todaysPrayerTimes[prayer.key];
      if (!timeStr) return { name: prayer.name, minutes: 0 };
      const [hours, minutes] = timeStr.split(":").map(Number);
      return { name: prayer.name, minutes: hours * 60 + minutes };
    });

    // Find next prayer
    for (const prayer of prayerMinutes) {
      if (prayer.minutes > currentTime) {
        return prayer.name;
      }
    }

    // If no prayer found today, next is Fajr tomorrow
    return "Fajr";
  };

  const getNextPrayerTime = () => {
    const nextPrayer = getCurrentTime();
    if (!todaysPrayerTimes) return "12:45 PM";
    
    const prayerKey = nextPrayer.toLowerCase();
    const timeStr = todaysPrayerTimes[prayerKey];
    return timeStr ? formatTime(timeStr) : "12:45 PM";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Today's Prayer Times
        </CardTitle>
        <p className="text-sm text-gray-500">Cape Town, South Africa</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prayerNames.map((prayer) => {
            const isNext = prayer.name === getCurrentTime();
            const timeStr = todaysPrayerTimes?.[prayer.key];
            
            return (
              <div 
                key={prayer.name}
                className={`flex items-center justify-between py-2 ${
                  isNext ? 'bg-primary-50 -mx-2 px-2 rounded' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    isNext ? 'bg-primary-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    isNext ? 'text-primary-700' : 'text-gray-900'
                  }`}>
                    {prayer.name}
                  </span>
                </div>
                <span className={`text-sm ${
                  isNext ? 'text-primary-600 font-medium' : 'text-gray-500'
                }`}>
                  {timeStr ? formatTime(timeStr) : "Not set"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button 
            className="w-full bg-primary-500 text-white hover:bg-primary-600"
            onClick={() => window.location.href = '/prayer-times'}
          >
            Update Prayer Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
