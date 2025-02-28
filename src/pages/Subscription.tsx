
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import subscriptionService, { Subscription, UserSubscription } from "@/services/subscriptionService";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutMode, setCheckoutMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subs, userSub] = await Promise.all([
          subscriptionService.getSubscriptions(),
          subscriptionService.getUserSubscription()
        ]);
        
        setSubscriptions(subs);
        setUserSubscription(userSub);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPlan = (plan: Subscription) => {
    setSelectedPlan(plan);
    setCheckoutMode(true);
  };

  const handlePaymentComplete = (subscription: UserSubscription) => {
    setUserSubscription(subscription);
    setCheckoutMode(false);
    toast({
      title: "Subscription Active",
      description: `Your ${subscription.plan?.name} plan is now active!`,
    });
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const updatedSubscription = await subscriptionService.cancelSubscription();
      setUserSubscription(updatedSubscription);
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p>Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription Plans</h1>
      <p className="text-muted-foreground mb-8">
        Choose the right plan for your advertising needs
      </p>

      {userSubscription?.status === "active" && !checkoutMode && (
        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span>{userSubscription.plan?.name || "Free"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={userSubscription.status === "active" ? "default" : "outline"}>
                  {userSubscription.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Expiry Date:</span>
                <span>{formatDate(userSubscription.endDate)}</span>
              </div>
              {userSubscription.plan && (
                <div className="flex justify-between">
                  <span className="font-medium">Campaign Limit:</span>
                  <span>{userSubscription.plan.max_campaigns} campaigns</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      )}

      {checkoutMode ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>
              Subscribing to {selectedPlan?.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Plan:</span>
                <span>{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Price:</span>
                <span>${selectedPlan?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Duration:</span>
                <span>{selectedPlan?.duration_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Campaign Limit:</span>
                <span>{selectedPlan?.max_campaigns} campaigns</span>
              </div>
            </div>

            <PaymentMethodSelector 
              subscription={selectedPlan!} 
              onPaymentComplete={handlePaymentComplete} 
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCheckoutMode(false)}>
              Back to Plans
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((plan) => (
                <Card key={plan.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.duration_days === 30 ? "Monthly plan" : "Custom plan"}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
                      <span className="text-muted-foreground ml-1">
                        /{plan.duration_days === 30 ? "month" : `${plan.duration_days} days`}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to {plan.max_campaigns} campaigns</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleSelectPlan(plan)}
                      variant={userSubscription?.plan?.id === plan.id ? "outline" : "default"}
                      disabled={userSubscription?.plan?.id === plan.id && userSubscription?.status === "active"}
                    >
                      {userSubscription?.plan?.id === plan.id && userSubscription?.status === "active"
                        ? "Current Plan"
                        : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="annual" className="space-y-4 mt-4">
            <div className="text-center p-8">
              <h3 className="text-xl font-medium mb-2">Annual Plans Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on annual subscription options with special discounts.
                Stay tuned!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SubscriptionPage;
