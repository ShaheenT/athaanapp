import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  CheckCircle, 
  Clock, 
  Volume2, 
  Wifi, 
  Shield, 
  Star,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Please select your location"),
  address: z.string().min(10, "Please enter your full address"),
  subscriptionType: z.enum(["monthly", "annual"]),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms and conditions"),
  agreeToMarketing: z.boolean().optional()
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function LandingSignup() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      subscriptionType: "monthly",
      agreeToTerms: false,
      agreeToMarketing: false
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const response = await apiRequest('POST', '/api/public/register', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "Please proceed to payment to activate your subscription.",
      });
      setStep(3);
      // Redirect to payment with registration data
      window.location.href = data.paymentUrl;
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    try {
      await registrationMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Building2 className="w-6 h-6 text-primary" />,
      title: "Authentic Prayer Calls",
      description: "Beautiful, traditional Athaan delivered at precise prayer times"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Accurate Timing",
      description: "GPS-based prayer time calculations for your exact location"
    },
    {
      icon: <Volume2 className="w-6 h-6 text-primary" />,
      title: "Premium Audio",
      description: "Crystal clear sound quality with adjustable volume controls"
    },
    {
      icon: <Wifi className="w-6 h-6 text-primary" />,
      title: "Smart Connectivity",
      description: "Wi-Fi enabled device with remote management capabilities"
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Reliable & Secure",
      description: "Professional installation with ongoing technical support"
    }
  ];

  const pricingPlans = [
    {
      name: "Monthly",
      price: "R299",
      period: "per month",
      value: "monthly",
      features: [
        "Athaan Fi Beit Audio Package",
        "Professional Installation",
        "24/7 Technical Support",
        "Prayer Time Updates",
        "Remote Management"
      ],
      popular: false
    },
    {
      name: "Annual",
      price: "R2,990",
      period: "per year",
      value: "annual",
      originalPrice: "R3,588",
      savings: "Save R598",
      features: [
        "Everything in Monthly",
        "2 Months FREE",
        "Priority Support",
        "Free Firmware Updates",
        "Extended Warranty"
      ],
      popular: true
    }
  ];

  const locations = [
    "Cape Town",
    "Johannesburg", 
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "Kimberley",
    "East London",
    "Pietermaritzburg",
    "Polokwane"
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-2xl">☪</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Athaan Fi Beit</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bring the blessed call to prayer into your home with our premium Islamic audio system
            </p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="ml-2 text-gray-600">Trusted by 500+ families</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 mb-8">Select the subscription that works best for you</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.value} 
                  className={`relative ${plan.popular ? 'border-primary border-2' : ''} hover:shadow-lg transition-shadow`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{plan.originalPrice}</span>
                        <span className="text-green-600 ml-2 font-semibold">{plan.savings}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => {
                        form.setValue("subscriptionType", plan.value as "monthly" | "annual");
                        setStep(2);
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-8">Trusted by Muslim Families Across South Africa</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Alhamdulillah, Athaan Fi Beit has transformed our home. The call to prayer reminds us of our duties to Allah."
                </p>
                <div className="font-semibold">Ahmed H. - Cape Town</div>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Professional installation and excellent sound quality. Highly recommend for every Muslim household."
                </p>
                <div className="font-semibold">Fatima A. - Johannesburg</div>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "The customer service is outstanding. Any issues are resolved quickly and professionally."
                </p>
                <div className="font-semibold">Omar M. - Durban</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
              <p className="text-gray-600">Join the Athaan Fi Beit family today</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ahmed Hassan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="ahmed@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+27 82 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Location Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Installation Location
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Address *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="123 Main Street, Suburb, City, Postal Code" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Subscription Plan */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Subscription Plan
                    </h3>
                    <FormField
                      control={form.control}
                      name="subscriptionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Selection</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly - R299/month</SelectItem>
                              <SelectItem value="annual">Annual - R2,990/year (Save R598!)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the <a href="/terms" className="text-primary underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary underline">Privacy Policy</a> *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="agreeToMarketing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I would like to receive updates about new features and Islamic content
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Proceed to Payment"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Registration Complete!</h2>
          <p className="text-gray-600">
            Redirecting you to secure payment processing...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}