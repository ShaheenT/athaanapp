import axios from 'axios';
import { storage } from './storage.ts';

interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      Sunrise: string;
      Sunset: string;
    };
    date: {
      readable: string;
      timestamp: string;
      hijri: {
        date: string;
        format: string;
        year: string;
        month: {
          number: number;
          en: string;
          ar: string;
        };
        day: string;
      };
      gregorian: {
        date: string;
        format: string;
        year: string;
        month: {
          number: number;
          en: string;
        };
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
      };
    };
  };
}

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export class PrayerCalculator {
  private readonly baseUrl = 'http://api.aladhan.com/v1';
  private readonly defaultMethod = 2; // ISNA (Islamic Society of North America)

  // South African cities with coordinates
  private readonly southAfricanCities: Record<string, Location> = {
    'Cape Town': {
      city: 'Cape Town',
      country: 'South Africa',
      latitude: -33.9249,
      longitude: 18.4241,
      timezone: 'Africa/Johannesburg'
    },
    'Johannesburg': {
      city: 'Johannesburg', 
      country: 'South Africa',
      latitude: -26.2041,
      longitude: 28.0473,
      timezone: 'Africa/Johannesburg'
    },
    'Durban': {
      city: 'Durban',
      country: 'South Africa', 
      latitude: -29.8587,
      longitude: 31.0218,
      timezone: 'Africa/Johannesburg'
    },
    'Pretoria': {
      city: 'Pretoria',
      country: 'South Africa',
      latitude: -25.7479,
      longitude: 28.2293,
      timezone: 'Africa/Johannesburg'
    },
    'Port Elizabeth': {
      city: 'Port Elizabeth',
      country: 'South Africa',
      latitude: -33.9580,
      longitude: 25.6022,
      timezone: 'Africa/Johannesburg'
    }
  };

  async calculatePrayerTimes(locationName: string, date?: string): Promise<any> {
    try {
      const location = this.southAfricanCities[locationName];
      if (!location) {
        throw new Error(`Location ${locationName} not supported`);
      }

      const targetDate = date || new Date().toISOString().split('T')[0];
      const [year, month, day] = targetDate.split('-');

      const url = `${this.baseUrl}/timings/${day}-${month}-${year}`;
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        method: this.defaultMethod,
        timezone: location.timezone || 'Africa/Johannesburg'
      };

      console.log(`Fetching prayer times for ${locationName} on ${targetDate}`);
      
      const response = await axios.get<PrayerTimesResponse>(url, { params });
      
      if (response.data.code !== 200) {
        throw new Error(`API Error: ${response.data.status}`);
      }

      const timings = response.data.data.timings;
      
      // Convert to 24-hour format and store in database
      const prayerTimes = {
        locationName: locationName,
        date: targetDate,
        fajr: this.convertTo24Hour(timings.Fajr),
        dhuhr: this.convertTo24Hour(timings.Dhuhr),
        asr: this.convertTo24Hour(timings.Asr),
        maghrib: this.convertTo24Hour(timings.Maghrib),
        isha: this.convertTo24Hour(timings.Isha),
        sunrise: this.convertTo24Hour(timings.Sunrise),
        sunset: this.convertTo24Hour(timings.Sunset),
        source: 'aladhan_api'
      };

      // Store in database
      await storage.createPrayerTimes(prayerTimes);

      console.log(`Prayer times calculated and stored for ${locationName}`);
      return prayerTimes;

    } catch (error) {
      console.error(`Failed to calculate prayer times for ${locationName}:`, error);
      throw error;
    }
  }

  async calculateMonthlyPrayerTimes(locationName: string, year: number, month: number): Promise<void> {
    try {
      const location = this.southAfricanCities[locationName];
      if (!location) {
        throw new Error(`Location ${locationName} not supported`);
      }

      const url = `${this.baseUrl}/calendar/${year}/${month}`;
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        method: this.defaultMethod,
        timezone: location.timezone || 'Africa/Johannesburg'
      };

      console.log(`Fetching monthly prayer times for ${locationName} - ${year}/${month}`);
      
      const response = await axios.get(url, { params });
      
      if (response.data.code !== 200) {
        throw new Error(`API Error: ${response.data.status}`);
      }

      const monthlyData = response.data.data;

      // Process each day of the month
      for (const dayData of monthlyData) {
        const timings = dayData.timings;
        const date = dayData.date.gregorian.date;

        const prayerTimes = {
          locationName: locationName,
          date: date,
          fajr: this.convertTo24Hour(timings.Fajr),
          dhuhr: this.convertTo24Hour(timings.Dhuhr),
          asr: this.convertTo24Hour(timings.Asr),
          maghrib: this.convertTo24Hour(timings.Maghrib),
          isha: this.convertTo24Hour(timings.Isha),
          sunrise: this.convertTo24Hour(timings.Sunrise),
          sunset: this.convertTo24Hour(timings.Sunset),
          source: 'aladhan_api'
        };

        try {
          await storage.createPrayerTimes(prayerTimes);
        } catch (error) {
          // Skip if already exists
          if (!error.message.includes('duplicate')) {
            console.error(`Failed to store prayer time for ${date}:`, error);
          }
        }
      }

      console.log(`Monthly prayer times calculated and stored for ${locationName}`);

    } catch (error) {
      console.error(`Failed to calculate monthly prayer times:`, error);
      throw error;
    }
  }

  private convertTo24Hour(time: string): string {
    // Remove timezone info and convert to 24-hour format
    const cleanTime = time.split(' ')[0];
    return cleanTime;
  }

  getSupportedLocations(): string[] {
    return Object.keys(this.southAfricanCities);
  }

  getLocationDetails(locationName: string): Location | null {
    return this.southAfricanCities[locationName] || null;
  }

  async autoCalculateTodaysPrayerTimes(): Promise<void> {
    const locations = this.getSupportedLocations();
    const today = new Date().toISOString().split('T')[0];

    for (const location of locations) {
      try {
        // Check if prayer times already exist for today
        const existing = await storage.getTodaysPrayerTimes(location);
        if (!existing) {
          await this.calculatePrayerTimes(location, today);
        }
      } catch (error) {
        console.error(`Failed to auto-calculate prayer times for ${location}:`, error);
      }
    }
  }

  async calculatePrayerTimesForAllLocations(date: string): Promise<void> {
    const locations = this.getSupportedLocations();

    for (const location of locations) {
      try {
        await this.calculatePrayerTimes(location, date);
      } catch (error) {
        console.error(`Failed to calculate prayer times for ${location} on ${date}:`, error);
      }
    }
  }
}

export const prayerCalculator = new PrayerCalculator();