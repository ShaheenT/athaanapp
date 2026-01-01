import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, VolumeX, Minus, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CustomerAuth {
  id: string;
  email: string;
  membershipId: string;
  fullName: string;
}

interface PrayerTimes {
  currentPrayer: { name: string; time: string } | null;
  nextPrayer: { name: string; time: string } | null;
}

export default function CustomerApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [customer, setCustomer] = useState<CustomerAuth | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  const { data: authData } = useQuery({
    queryKey: ["/api/customer/auth"],
    enabled: !isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (authData) {
      setCustomer(authData);
      setIsAuthenticated(true);
    }
  }, [authData]);

  // Get prayer times
  const { data: prayerData } = useQuery<PrayerTimes>({
    queryKey: ["/api/customer/prayer-times"],
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refresh every minute
  });

  // Get device status
  const { data: deviceStatus } = useQuery({
    queryKey: ['/api/customer/device-status'],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email?: string; userId?: string; password: string }) => {
      const res = await apiRequest("POST", "/api/customer/login", credentials);
      return await res.json();
    },
    onSuccess: (data: CustomerAuth) => {
      setCustomer(data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["/api/customer/prayer-times"] });
      toast({
        title: "Welcome back!",
        description: `Assalamu Alaikum, ${data.fullName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Volume control mutation
  const volumeMutation = useMutation({
    mutationFn: async (newVolume: number) => {
      await apiRequest("POST", "/api/customer/volume", { volume: newVolume });
    },
    onSuccess: () => {
      toast({
        title: "Volume updated",
        description: `Volume set to ${volume}%`,
      });
    },
  });

  // Mute control mutation
  const muteMutation = useMutation({
    mutationFn: async (muted: boolean) => {
      await apiRequest("POST", "/api/customer/mute", { muted });
    },
    onSuccess: () => {
      toast({
        title: muted ? "Athaan muted" : "Athaan unmuted",
        description: muted ? "You will not hear the call to prayer" : "You will hear the call to prayer",
      });
    },
  });

  const handleVolumeChange = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
    volumeMutation.mutate(newVolume);
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    muteMutation.mutate(newMuted);
  };

  const handleLogin = (formData: FormData, loginType: 'email' | 'userId') => {
    const password = formData.get('password') as string;
    
    if (loginType === 'email') {
      const email = formData.get('email') as string;
      loginMutation.mutate({ email, password });
    } else {
      const userId = formData.get('userId') as string;
      loginMutation.mutate({ userId, password });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-6xl">☪</div>
          <div className="absolute top-40 right-20 text-4xl">☪</div>
          <div className="absolute bottom-20 left-20 text-5xl">☪</div>
          <div className="absolute bottom-40 right-10 text-3xl">☪</div>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Enhanced Logo */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl font-bold">☪</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Athaan Fi Beit
              </h1>
              <p className="text-gray-500 text-sm mt-2">Your Islamic Prayer Companion</p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="email" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="userId"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  User ID
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="mt-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleLogin(formData, 'email');
                }}>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="mt-2 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                        <Button
                          type="button"
                          variant="link"
                          className="text-emerald-600 hover:text-emerald-700 p-0 h-auto text-sm"
                          onClick={() => toast({ title: "Reset link sent", description: "Check your email for password reset instructions" })}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-2 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="userId" className="mt-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleLogin(formData, 'userId');
                }}>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="userId" className="text-gray-700 font-medium">Membership ID</Label>
                      <Input
                        id="userId"
                        name="userId"
                        placeholder="e.g. MEM001"
                        className="mt-2 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                        <Button
                          type="button"
                          variant="link"
                          className="text-emerald-600 hover:text-emerald-700 p-0 h-auto text-sm"
                          onClick={() => toast({ title: "Reset link sent", description: "Check your email for password reset instructions" })}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-2 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Footer */}
            <div className="text-center mt-8 text-xs text-gray-400">
              <p>Download this app to your homescreen for easy access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-4xl">☪</div>
        <div className="absolute top-20 right-20 text-3xl">☪</div>
        <div className="absolute bottom-20 left-20 text-5xl">☪</div>
        <div className="absolute bottom-10 right-10 text-2xl">☪</div>
      </div>

      <div className="max-w-md mx-auto pt-12 pb-8 px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white text-4xl font-bold">☪</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Athaan Fi Beit
          </h1>
          <p className="text-gray-500">Assalamu Alaikum, {customer?.fullName}</p>
        </div>

        {/* Volume Controls */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Athaan Volume</h2>
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={handleMuteToggle}
                disabled={muteMutation.isPending}
                className={`px-6 py-3 font-medium rounded-xl transition-all duration-200 ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
            
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVolumeChange(volume - 10)}
                disabled={volume <= 0 || volumeMutation.isPending}
                className="w-12 h-12 rounded-full border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50"
              >
                <Minus className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{volume}%</div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${volume}%` }}
                  ></div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVolumeChange(volume + 10)}
                disabled={volume >= 100 || volumeMutation.isPending}
                className="w-12 h-12 rounded-full border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Prayer - Prominent Display */}
        {prayerData?.currentPrayer && (
          <Card className="mb-6 shadow-xl border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-8 text-center">
              <p className="text-emerald-100 font-medium mb-2">Current Prayer</p>
              <h2 className="text-4xl font-bold mb-2">{prayerData.currentPrayer.name}</h2>
              <p className="text-2xl font-medium text-emerald-100">{prayerData.currentPrayer.time}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Prayer */}
        {prayerData?.nextPrayer && (
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 font-medium mb-2">Next Prayer</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{prayerData.nextPrayer.name}</h3>
              <p className="text-xl text-gray-700">{prayerData.nextPrayer.time}</p>
            </CardContent>
          </Card>
        )}

        {!prayerData && (
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Info */}
        <div className="text-center text-gray-500">
          <p>Member ID: {customer?.membershipId}</p>
        </div>
      </div>
    </div>
  );
}