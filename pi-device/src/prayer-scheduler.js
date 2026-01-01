import cron from 'node-cron';

export class PrayerScheduler {
  constructor() {
    this.prayerTimes = {};
    this.scheduledJobs = [];
    this.playCallback = null;
    this.running = false;
  }

  start(playCallback) {
    this.playCallback = playCallback;
    this.running = true;
    
    console.log('🕌 Prayer scheduler started');
    
    // Load today's prayer times
    this.loadTodaysPrayerTimes();
    
    // Schedule daily prayer times reload at midnight
    cron.schedule('0 0 * * *', () => {
      console.log('🕌 Loading new prayer times for today');
      this.loadTodaysPrayerTimes();
    });
  }

  stop() {
    this.running = false;
    this.clearScheduledJobs();
    console.log('🕌 Prayer scheduler stopped');
  }

  async loadTodaysPrayerTimes() {
    try {
      // For now, use default prayer times
      // In production, this would fetch from the dashboard API
      const today = new Date().toISOString().split('T')[0];
      
      this.prayerTimes = {
        fajr: '05:15',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:42',
        isha: '20:15'
      };

      // For testing: create next prayer 2 minutes from now
      const now = new Date();
      const testTime = new Date(now.getTime() + 2 * 60 * 1000);
      this.prayerTimes.test = `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`;

      console.log('🕌 Prayer times loaded:', this.prayerTimes);
      console.log('🕌 TEST prayer scheduled for:', this.prayerTimes.test, '(2 minutes from now)');
      this.schedulePrayerTimes();
      
    } catch (error) {
      console.error('🕌 Failed to load prayer times:', error);
    }
  }

  schedulePrayerTimes() {
    // Clear existing scheduled jobs
    this.clearScheduledJobs();

    // Schedule each prayer
    Object.entries(this.prayerTimes).forEach(([prayer, time]) => {
      const [hours, minutes] = time.split(':');
      const cronExpression = `${minutes} ${hours} * * *`;
      
      console.log(`🕌 Scheduling ${prayer} at ${time} (cron: ${cronExpression})`);
      
      const job = cron.schedule(cronExpression, () => {
        if (this.playCallback && this.running) {
          const prayerInfo = {
            name: this.capitalizeFirst(prayer),
            time: time,
            scheduledAt: new Date().toISOString()
          };
          
          console.log(`🕌 Time for ${prayerInfo.name} prayer`);
          this.playCallback(prayerInfo);
        }
      }, {
        scheduled: true,
        timezone: "UTC" // Should be configured based on location
      });

      this.scheduledJobs.push({
        prayer,
        time,
        job
      });
    });

    console.log(`🕌 Scheduled ${this.scheduledJobs.length} prayer times`);
  }

  clearScheduledJobs() {
    this.scheduledJobs.forEach(({ job }) => {
      job.destroy();
    });
    this.scheduledJobs = [];
  }

  updatePrayerTimes(newPrayerTimes) {
    console.log('🕌 Updating prayer times:', newPrayerTimes);
    this.prayerTimes = { ...newPrayerTimes };
    this.schedulePrayerTimes();
  }

  getScheduledPrayers() {
    const now = new Date();
    const prayers = Object.entries(this.prayerTimes).map(([name, time]) => ({
      name: this.capitalizeFirst(name),
      time,
      minutes: this.timeToMinutes(time),
      scheduled: true
    })).sort((a, b) => a.minutes - b.minutes);
    return prayers;
  }

  getNextPrayer() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentMinutes = this.timeToMinutes(currentTime);
    
    const prayers = this.getScheduledPrayers();
    
    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].minutes > currentMinutes) {
        return prayers[i];
      }
    }
    return prayers[0]; // First prayer of next day
  }

  getCurrentPrayer() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayers = this.getScheduledPrayers();
    const currentMinutes = this.timeToMinutes(currentTime);
    
    // Find current prayer (last prayer that has passed)
    let currentPrayer = null;
    let nextPrayer = null;

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].minutes <= currentMinutes) {
        currentPrayer = prayers[i];
        nextPrayer = prayers[i + 1] || prayers[0]; // Next day's first prayer
      } else {
        if (!currentPrayer) {
          // Before first prayer of the day
          currentPrayer = prayers[prayers.length - 1]; // Previous day's last prayer
          nextPrayer = prayers[i];
        }
        break;
      }
    }

    return {
      current: currentPrayer,
      next: nextPrayer
    };
  }

  getNextPrayer() {
    const { next } = this.getCurrentPrayer();
    return next;
  }

  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getPrayerTimes() {
    return this.prayerTimes;
  }

  getScheduledJobs() {
    return this.scheduledJobs.map(({ prayer, time }) => ({
      prayer: this.capitalizeFirst(prayer),
      time,
      scheduled: true
    }));
  }

  // Manual prayer trigger for testing
  triggerPrayer(prayerName) {
    if (this.playCallback && this.running) {
      const prayerInfo = {
        name: this.capitalizeFirst(prayerName),
        time: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        scheduledAt: new Date().toISOString(),
        manual: true
      };
      
      console.log(`🕌 Manually triggering ${prayerInfo.name} prayer`);
      this.playCallback(prayerInfo);
    }
  }
}