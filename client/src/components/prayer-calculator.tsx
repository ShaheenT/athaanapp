import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calculator, Calendar, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PrayerCalculator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [calculation, setCalculation] = useState({
    location: 'Cape Town',
    date: new Date().toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const calculateDayMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/prayer-calculator/calculate-day', {
        location: calculation.location,
        date: calculation.date
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-times'] });
      toast({
        title: "Prayer times calculated",
        description: `Prayer times for ${calculation.location} on ${calculation.date} have been calculated and saved`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const calculateMonthMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/prayer-calculator/calculate-month', {
        location: calculation.location,
        month: calculation.month,
        year: calculation.year
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-times'] });
      toast({
        title: "Monthly prayer times calculated",
        description: `Prayer times for ${calculation.location} for ${calculation.month}/${calculation.year} have been calculated and saved`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const autoCalculateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/prayer-calculator/auto-calculate');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-times'] });
      toast({
        title: "Auto-calculation completed",
        description: "Today's prayer times have been automatically calculated for all locations",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Auto-calculation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Prayer Time Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Selection */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Select 
            value={calculation.location} 
            onValueChange={(value) => setCalculation(prev => ({ ...prev, location: value }))}
          >
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

        {/* Single Day Calculation */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Calculate Single Day
          </h3>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={calculation.date}
              onChange={(e) => setCalculation(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <Button
            onClick={() => calculateDayMutation.mutate()}
            disabled={calculateDayMutation.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {calculateDayMutation.isPending ? 'Calculating...' : 'Calculate Day'}
          </Button>
        </div>

        {/* Monthly Calculation */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Calculate Entire Month
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Select 
                value={calculation.month.toString()} 
                onValueChange={(value) => setCalculation(prev => ({ ...prev, month: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(2024, i).toLocaleDateString('en', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min="2024"
                max="2030"
                value={calculation.year}
                onChange={(e) => setCalculation(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <Button
            onClick={() => calculateMonthMutation.mutate()}
            disabled={calculateMonthMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {calculateMonthMutation.isPending ? 'Calculating...' : 'Calculate Month'}
          </Button>
        </div>

        {/* Auto Calculate */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Auto Calculate All Locations
          </h3>
          <p className="text-sm text-gray-600">
            Calculate today's prayer times for all supported South African cities
          </p>
          <Button
            onClick={() => autoCalculateMutation.mutate()}
            disabled={autoCalculateMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {autoCalculateMutation.isPending ? 'Calculating...' : 'Auto Calculate Today'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}