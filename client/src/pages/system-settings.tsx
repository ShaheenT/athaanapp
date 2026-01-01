import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Globe, Bell, Shield, Database, Cloud, Wifi, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
// import LanguageSelector from "@/components/language-selector";

export default function SystemSettingsPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Athaan Fi Beit',
    systemDescription: 'Islamic Prayer Time Management System',
    defaultLocation: 'Cape Town',
    timeZone: 'Africa/Johannesburg',
    
    // Prayer Settings
    prayerApiEnabled: true,
    prayerApiUrl: 'http://api.aladhan.com/v1',
    defaultVolume: 75,
    fadeInDuration: 5,
    fadeOutDuration: 3,
    
    // Notification Settings
    enablePushNotifications: true,
    prayerAlertMinutes: 10,
    paymentReminderDays: 3,
    maintenanceNotifications: true,
    
    // Security Settings
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    
    // API Settings
    paymentGateway: 'payfast',
    paymentTestMode: false,
    webhookUrl: '',
    
    // System Settings
    enableLogging: true,
    logLevel: 'info',
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: any) => {
      const response = await apiRequest('POST', '/api/system/settings', settingsData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-8 h-8 text-emerald-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('systemSettings')}</h1>
                  <p className="text-gray-600">Configure system-wide settings and preferences</p>
                </div>
              </div>
              <Button 
                onClick={handleSaveSettings}
                disabled={saveSettingsMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saveSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systemName">System Name</Label>
                    <Input
                      id="systemName"
                      value={settings.systemName}
                      onChange={(e) => updateSetting('systemName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultLocation">Default Location</Label>
                    <Select 
                      value={settings.defaultLocation} 
                      onValueChange={(value) => updateSetting('defaultLocation', value)}
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
                </div>
                
                <div>
                  <Label htmlFor="systemDescription">System Description</Label>
                  <Textarea
                    id="systemDescription"
                    value={settings.systemDescription}
                    onChange={(e) => updateSetting('systemDescription', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Language Settings</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Prayer Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Prayer Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Prayer API</Label>
                    <p className="text-sm text-gray-600">Use Aladhan API for real-time prayer times</p>
                  </div>
                  <Switch
                    checked={settings.prayerApiEnabled}
                    onCheckedChange={(checked) => updateSetting('prayerApiEnabled', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultVolume">Default Volume (%)</Label>
                    <Input
                      id="defaultVolume"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.defaultVolume}
                      onChange={(e) => updateSetting('defaultVolume', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fadeInDuration">Fade In Duration (seconds)</Label>
                    <Input
                      id="fadeInDuration"
                      type="number"
                      min="0"
                      max="30"
                      value={settings.fadeInDuration}
                      onChange={(e) => updateSetting('fadeInDuration', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fadeOutDuration">Fade Out Duration (seconds)</Label>
                    <Input
                      id="fadeOutDuration"
                      type="number"
                      min="0"
                      max="30"
                      value={settings.fadeOutDuration}
                      onChange={(e) => updateSetting('fadeOutDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Push Notifications</Label>
                    <p className="text-sm text-gray-600">Send prayer alerts and payment reminders</p>
                  </div>
                  <Switch
                    checked={settings.enablePushNotifications}
                    onCheckedChange={(checked) => updateSetting('enablePushNotifications', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prayerAlertMinutes">Prayer Alert (minutes before)</Label>
                    <Input
                      id="prayerAlertMinutes"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.prayerAlertMinutes}
                      onChange={(e) => updateSetting('prayerAlertMinutes', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentReminderDays">Payment Reminder (days before due)</Label>
                    <Input
                      id="paymentReminderDays"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.paymentReminderDays}
                      onChange={(e) => updateSetting('paymentReminderDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="72"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Strong Passwords</Label>
                      <p className="text-sm text-gray-600">Enforce password complexity requirements</p>
                    </div>
                    <Switch
                      checked={settings.requireStrongPasswords}
                      onCheckedChange={(checked) => updateSetting('requireStrongPasswords', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.enableTwoFactor}
                      onCheckedChange={(checked) => updateSetting('enableTwoFactor', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  System Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Temporarily disable system for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-gray-600">Automatically backup system data</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                  />
                </div>
                
                <div>
                  <Label>Backup Frequency</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => updateSetting('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}