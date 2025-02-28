
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import subscriptionService, { PaymentConfig, Subscription } from "@/services/subscriptionService";

interface PaymentMethodSelectorProps {
  subscription: Subscription;
  onPaymentComplete: (subscriptionData: any) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  subscription,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);

  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        setLoading(true);
        const config = await subscriptionService.getPaymentConfig();
        setPaymentConfig(config);
        
        // Set default payment method
        if (config.stripe.publishableKey) {
          setPaymentMethod("stripe");
        } else if (config.paypal.clientId) {
          setPaymentMethod("paypal");
        } else if (config.mpesa.enabled) {
          setPaymentMethod("mpesa");
        }
      } catch (error) {
        console.error("Failed to load payment configuration:", error);
        toast({
          title: "Error",
          description: "Failed to load payment options. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentConfig();
  }, []);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingPayment(true);

      if (paymentMethod === "stripe") {
        // For demo purposes, we'll simulate a successful payment
        // In a real app, you would integrate with Stripe.js
        const response = await subscriptionService.subscribeWithStripe(
          subscription.id,
          "pm_card_visa" // This would be a real payment method ID in production
        );
        
        // Simulate payment confirmation
        setTimeout(async () => {
          try {
            const result = await subscriptionService.confirmPayment(
              subscription.id,
              response.paymentIntentId,
              "stripe"
            );
            onPaymentComplete(result);
            toast({
              title: "Success",
              description: "Your subscription has been activated successfully!",
            });
          } catch (error: any) {
            toast({
              title: "Payment Error",
              description: error.message || "Failed to confirm payment",
              variant: "destructive",
            });
          } finally {
            setProcessingPayment(false);
          }
        }, 2000);
      } 
      else if (paymentMethod === "paypal") {
        // Simulate PayPal flow
        const response = await subscriptionService.subscribeWithPaypal(subscription.id);
        
        // In a real app, you would redirect the user to the PayPal approval URL
        // and handle the return with confirmation
        toast({
          title: "PayPal",
          description: "In a real app, you would be redirected to PayPal now.",
        });
        
        // Simulate successful payment for demo
        setTimeout(async () => {
          try {
            const result = await subscriptionService.confirmPayment(
              subscription.id,
              response.paymentId,
              "paypal",
              "PAYPAL_PAYER_ID" // This would be returned by PayPal in production
            );
            onPaymentComplete(result);
            toast({
              title: "Success",
              description: "Your subscription has been activated successfully!",
            });
          } catch (error: any) {
            toast({
              title: "Payment Error",
              description: error.message || "Failed to confirm payment",
              variant: "destructive",
            });
          } finally {
            setProcessingPayment(false);
          }
        }, 2000);
      } 
      else if (paymentMethod === "mpesa") {
        if (!phoneNumber) {
          toast({
            title: "Error",
            description: "Please enter your phone number for MPESA payment",
            variant: "destructive",
          });
          setProcessingPayment(false);
          return;
        }
        
        // Process MPESA payment
        const response = await subscriptionService.subscribeWithMpesa(
          subscription.id,
          phoneNumber
        );
        
        toast({
          title: "MPESA Payment Initiated",
          description: "Please check your phone to complete the transaction",
        });
        
        // In a real app, you would wait for the MPESA callback
        // Here we'll simulate a successful payment for demo purposes
        setTimeout(async () => {
          try {
            const result = await subscriptionService.confirmPayment(
              subscription.id,
              response.requestId,
              "mpesa"
            );
            onPaymentComplete(result);
            toast({
              title: "Success",
              description: "Your subscription has been activated successfully!",
            });
          } catch (error: any) {
            toast({
              title: "Payment Error",
              description: error.message || "Failed to confirm payment",
              variant: "destructive",
            });
          } finally {
            setProcessingPayment(false);
          }
        }, 3000);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          disabled={processingPayment}
        >
          <SelectTrigger id="payment-method" className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentConfig?.stripe.publishableKey && (
              <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
            )}
            {paymentConfig?.paypal.clientId && (
              <SelectItem value="paypal">PayPal</SelectItem>
            )}
            {paymentConfig?.mpesa.enabled && (
              <SelectItem value="mpesa">MPESA</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {paymentMethod === "mpesa" && (
        <div className="space-y-2">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input
            id="phone-number"
            placeholder="e.g., +254722000000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={processingPayment}
          />
          <p className="text-sm text-muted-foreground">
            Enter your MPESA registered phone number
          </p>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handlePayment}
        disabled={!paymentMethod || processingPayment || (paymentMethod === "mpesa" && !phoneNumber)}
      >
        {processingPayment ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          `Pay ${subscription.price.toFixed(2)} for ${subscription.name}`
        )}
      </Button>
    </div>
  );
};

export default PaymentMethodSelector;
