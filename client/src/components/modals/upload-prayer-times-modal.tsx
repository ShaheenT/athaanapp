import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPrayerTimesSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UploadPrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadPrayerTimesModal({ isOpen, onClose }: UploadPrayerTimesModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertPrayerTimesSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      locationHash: "",
      locationName: "Cape Town",
      fajr: "05:45",
      dhuhr: "12:45",
      asr: "16:20",
      maghrib: "19:15",
      isha: "20:45",
      source: "manual",
    },
  });

  const createPrayerTimesMutation = useMutation({
    mutationFn: async (data: any) => {
      // Generate location hash based on city name
      const locationHash = `${data.locationName.toLowerCase().replace(/\s+/g, '-')}-za`;
      
      await apiRequest("POST", "/api/prayer-times", {
        ...data,
        locationHash,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-times"] });
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-times/today/Cape Town"] });
      toast({
        title: "Success",
        description: "Prayer times uploaded successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload prayer times",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createPrayerTimesMutation.mutate(data);
  };

  const southAfricanCities = [
    "Cape Town",
    "Johannesburg", 
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "Pietermaritzburg",
    "East London",
    "Kimberley",
    "Polokwane"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Prayer Times</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {southAfricanCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Prayer Times</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fajr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fajr</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dhuhr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dhuhr</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="asr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asr</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maghrib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maghrib</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Isha</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="aladhan">Aladhan API</SelectItem>
                          <SelectItem value="local_calc">Local Calculation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPrayerTimesMutation.isPending}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {createPrayerTimesMutation.isPending ? "Uploading..." : "Upload Prayer Times"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
