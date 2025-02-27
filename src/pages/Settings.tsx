
import { useState } from "react";
import { 
  Bell, 
  User, 
  Lock, 
  CreditCard, 
  Globe, 
  UserCog, 
  Shield,
  Database,
  Save
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const accountFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  bio: z.string().optional(),
});

const notificationFormSchema = z.object({
  marketingEmails: z.boolean().default(false),
  socialEmails: z.boolean().default(false),
  campaignUpdates: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
});

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.enum(["15m", "30m", "1h", "1d"], { 
    required_error: "You need to select a session timeout.", 
  }),
});

const billingFormSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"], { 
    required_error: "You need to select a plan.", 
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type BillingFormValues = z.infer<typeof billingFormSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");

  // Account Form
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Marketing professional with 5+ years of experience in digital advertising.",
    },
  });

  // Notification Form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      marketingEmails: false,
      socialEmails: false,
      campaignUpdates: true,
      weeklyDigest: true,
    },
  });

  // Security Form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: "30m",
    },
  });

  // Billing Form
  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      plan: "free",
    },
  });

  function onAccountSubmit(data: AccountFormValues) {
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
    });
    console.log(data);
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
    console.log(data);
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
    });
    console.log(data);
  }

  function onBillingSubmit(data: BillingFormValues) {
    toast({
      title: "Billing information updated",
      description: "Your billing information has been updated successfully.",
    });
    console.log(data);
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid md:grid-cols-4 grid-cols-2 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Account Information</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal information and profile settings.
                </p>
              </div>
              <Separator className="my-6" />
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <FormField
                    control={accountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the email used for account notifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a little about yourself" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Manage how and when you receive notifications.
                </p>
              </div>
              <Separator className="my-6" />
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive emails about new features and promotions.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="socialEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Social Notifications</FormLabel>
                          <FormDescription>
                            Receive emails about social interactions and mentions.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="campaignUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Campaign Updates</FormLabel>
                          <FormDescription>
                            Receive notifications about your campaign performance.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="weeklyDigest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Weekly Digest</FormLabel>
                          <FormDescription>
                            Receive a weekly summary of your account activity.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Security Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your account security and privacy.
                </p>
              </div>
              <Separator className="my-6" />
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">Password</h3>
                    <Button variant="outline" className="w-full md:w-auto">
                      Change Password
                    </Button>
                  </div>
                  <Separator />
                  <FormField
                    control={securityForm.control}
                    name="twoFactorAuth"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Add an extra layer of security to your account.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout</FormLabel>
                        <FormDescription>
                          How long until your session automatically expires.
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4 pt-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="15m" />
                              </FormControl>
                              <FormLabel className="font-normal">15 minutes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="30m" />
                              </FormControl>
                              <FormLabel className="font-normal">30 minutes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1h" />
                              </FormControl>
                              <FormLabel className="font-normal">1 hour</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1d" />
                              </FormControl>
                              <FormLabel className="font-normal">1 day</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Billing Information</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and payment details.
                </p>
              </div>
              <Separator className="my-6" />
              <Form {...billingForm}>
                <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-6">
                  <FormField
                    control={billingForm.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Plan</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4 pt-2"
                          >
                            <FormItem className="flex flex-col space-y-2 space-x-0 rounded-lg border p-4">
                              <div className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="free" />
                                </FormControl>
                                <FormLabel className="font-semibold">Free Plan</FormLabel>
                              </div>
                              <FormDescription className="pl-6">
                                Basic features with limited campaign creation.
                              </FormDescription>
                            </FormItem>
                            <FormItem className="flex flex-col space-y-2 space-x-0 rounded-lg border p-4">
                              <div className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="pro" />
                                </FormControl>
                                <FormLabel className="font-semibold">Pro Plan - $29/month</FormLabel>
                              </div>
                              <FormDescription className="pl-6">
                                Advanced features with unlimited campaign creation.
                              </FormDescription>
                            </FormItem>
                            <FormItem className="flex flex-col space-y-2 space-x-0 rounded-lg border p-4">
                              <div className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="enterprise" />
                                </FormControl>
                                <FormLabel className="font-semibold">Enterprise - $99/month</FormLabel>
                              </div>
                              <FormDescription className="pl-6">
                                Full access to all features with priority support.
                              </FormDescription>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={billingForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={billingForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={billingForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Billing Information
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
