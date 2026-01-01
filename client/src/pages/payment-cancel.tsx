import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-600 to-yellow-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-orange-800">
                <div className="font-semibold">What happens now?</div>
                <div>• Your subscription remains as is</div>
                <div>• You can retry payment anytime</div>
                <div>• Contact support if you need assistance</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/customer">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Payment Again
              </Button>
            </Link>
            
            <Link href="/customer">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team for assistance with your payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}