import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["/api/activity-logs", 10],
  });

  const getActivityIcon = (eventType: string) => {
    switch (eventType) {
      case 'device_online':
      case 'heartbeat':
        return "w-2 h-2 bg-green-400 rounded-full mt-2";
      case 'prayer_times_updated':
        return "w-2 h-2 bg-blue-400 rounded-full mt-2";
      case 'user_created':
        return "w-2 h-2 bg-orange-400 rounded-full mt-2";
      case 'device_offline':
        return "w-2 h-2 bg-red-400 rounded-full mt-2";
      default:
        return "w-2 h-2 bg-primary-400 rounded-full mt-2";
    }
  };

  const formatActivityDescription = (log: any) => {
    return log.description || `${log.eventType} event`;
  };

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading activity...</div>
        ) : !activityLogs?.length ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity found.
          </div>
        ) : (
          <div className="space-y-4">
            {activityLogs.slice(0, 10).map((log: any) => (
              <div key={log.id} className="flex items-start space-x-3">
                <div className={getActivityIcon(log.eventType)}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{formatActivityDescription(log)}</p>
                    <span className="text-xs text-gray-500">{getTimeAgo(log.timestamp)}</span>
                  </div>
                  {log.metadata && (
                    <p className="text-xs text-gray-500">
                      {log.metadata.deviceSerial && `Device: ${log.metadata.deviceSerial}`}
                      {log.metadata.location && `Location: ${log.metadata.location}`}
                      {log.metadata.customerMembershipId && `Member: ${log.metadata.customerMembershipId}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
