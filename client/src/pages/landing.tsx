import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">☪</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Athaan Fi Beit</h1>
              <p className="text-lg text-gray-600">Islamic Prayer Time Management System</p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Bringing the Sacred Call to Prayer into Your Home
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Experience the beauty of automated Athaan delivery through our innovative IoT system. 
              Our ceiling-mounted speakers and smart management ensure you never miss a prayer time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started - Sign Up Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 px-8 py-3 text-lg"
                onClick={() => window.location.href = '/demo'}
              >
                View Athaan Fi Beit Dashboard
              </Button>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Button 
                variant="ghost"
                className="text-primary hover:bg-primary/5"
                onClick={() => window.location.href = '/admin/login'}
              >
                Admin Login
              </Button>
              <Button 
                variant="ghost"
                className="text-primary hover:bg-primary/5"
                onClick={() => window.location.href = '/customer'}
              >
                Customer Portal (PWA)
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <CardTitle className="text-center">Automated Prayer Times</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Precise prayer time calculations with automatic Athaan playback five times daily
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <CardTitle className="text-center">IoT Device Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Remote monitoring and control of Raspberry Pi devices with real-time status updates
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v5a3 3 0 11-6 0V9z"></path>
                  </svg>
                </div>
                <CardTitle className="text-center">Audio Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Multiple Athaan voice options with customizable volume control for each location
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">System Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p><strong>Admin Dashboard:</strong> Comprehensive management of users, devices, and prayer schedules</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <p><strong>Customer Portal:</strong> User registration, payment tracking, and volume control</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <p><strong>IoT Integration:</strong> Raspberry Pi devices with automated prayer time delivery</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p><strong>Technician Support:</strong> Installation tracking and device maintenance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
