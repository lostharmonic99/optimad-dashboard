
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Facebook, Instagram, User } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const stepOneSchema = z.object({
  businessName: z.string().min(2, { message: "Business name is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  businessSize: z.enum(["solo", "small", "medium", "large"], {
    required_error: "Please select your business size",
  }),
});

const stepTwoSchema = z.object({
  platforms: z.array(z.string()).min(1, { message: "Please select at least one platform" }),
  monthlyBudget: z.enum(["under1k", "1k-5k", "5k-10k", "10k-50k", "50k+"], {
    required_error: "Please select your monthly advertising budget",
  }),
});

const stepThreeSchema = z.object({
  objectives: z.array(z.string()).min(1, { message: "Please select at least one objective" }),
  experience: z.enum(["none", "beginner", "intermediate", "expert"], {
    required_error: "Please select your experience level",
  }),
});

type StepOneFormValues = z.infer<typeof stepOneSchema>;
type StepTwoFormValues = z.infer<typeof stepTwoSchema>;
type StepThreeFormValues = z.infer<typeof stepThreeSchema>;

const Onboarding = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    businessName: "",
    website: "",
    businessSize: "",
    platforms: [] as string[],
    monthlyBudget: "",
    objectives: [] as string[],
    experience: "",
  });

  // Step One Form
  const stepOneForm = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      businessName: "",
      website: "",
      businessSize: "small",
    },
  });

  // Step Two Form
  const stepTwoForm = useForm<StepTwoFormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      platforms: [],
      monthlyBudget: "1k-5k",
    },
  });

  // Step Three Form
  const stepThreeForm = useForm<StepThreeFormValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      objectives: [],
      experience: "beginner",
    },
  });

  const onStepOneSubmit = (data: StepOneFormValues) => {
    console.log("Step One Data:", data);
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStepTwoSubmit = (data: StepTwoFormValues) => {
    console.log("Step Two Data:", data);
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onStepThreeSubmit = async (data: StepThreeFormValues) => {
    const finalData = { ...onboardingData, ...data };
    console.log("All Onboarding Data:", finalData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Onboarding complete!",
      description: "Your account is now set up and ready to use.",
    });
    
    // In a real app, you would redirect to the dashboard or home page
    console.log("Onboarding complete, would redirect to dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left sidebar - Progress */}
      <div className="hidden md:flex md:w-1/4 bg-optimad-50 border-r border-border p-6 flex-col">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-optimad-600 to-optimad-800 bg-clip-text text-transparent mb-10"
        >
          Optimad
        </Link>
        
        <div className="space-y-8 mt-10">
          <div className="flex items-start">
            <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
              step >= 1 ? "bg-optimad-600 text-white" : "bg-gray-200 text-gray-500"
            } mr-4`}>
              {step > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <div>
              <h3 className={`font-medium ${step >= 1 ? "text-optimad-600" : "text-gray-500"}`}>
                Your Business
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us about your company
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
              step >= 2 ? "bg-optimad-600 text-white" : "bg-gray-200 text-gray-500"
            } mr-4`}>
              {step > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <div>
              <h3 className={`font-medium ${step >= 2 ? "text-optimad-600" : "text-gray-500"}`}>
                Advertising Platforms
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select your ad platforms & budget
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
              step >= 3 ? "bg-optimad-600 text-white" : "bg-gray-200 text-gray-500"
            } mr-4`}>
              {step > 3 ? <Check className="h-5 w-5" /> : "3"}
            </div>
            <div>
              <h3 className={`font-medium ${step >= 3 ? "text-optimad-600" : "text-gray-500"}`}>
                Goals & Experience
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us your marketing objectives
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {/* Mobile progress indicator */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-optimad-600 to-optimad-800 bg-clip-text text-transparent"
          >
            Optimad
          </Link>
          <div className="text-sm font-medium">Step {step} of 3</div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Tell us about your business</h1>
              <p className="text-muted-foreground">
                We'll use this information to personalize your experience.
              </p>
            </div>
            
            <Form {...stepOneForm}>
              <form onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)} className="space-y-6">
                <FormField
                  control={stepOneForm.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepOneForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepOneForm.control}
                  name="businessSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Size</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="solo" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Solo / Freelancer
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="small" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Small (1-10 employees)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Medium (11-50 employees)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="large" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Large (50+ employees)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 2: Advertising Platforms */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Select your advertising platforms</h1>
              <p className="text-muted-foreground">
                Choose the platforms you want to advertise on and your monthly budget.
              </p>
            </div>
            
            <Form {...stepTwoForm}>
              <form onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)} className="space-y-6">
                <FormField
                  control={stepTwoForm.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advertising Platforms</FormLabel>
                      <FormDescription>
                        Select all the platforms you want to use for your campaigns.
                      </FormDescription>
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <FormField
                          control={stepTwoForm.control}
                          name="platforms"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("facebook")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "facebook"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "facebook"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  <div className="flex items-center">
                                    <Facebook className="h-4 w-4 text-blue-600 mr-2" />
                                    Facebook
                                  </div>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepTwoForm.control}
                          name="platforms"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("instagram")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "instagram"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "instagram"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  <div className="flex items-center">
                                    <Instagram className="h-4 w-4 text-pink-600 mr-2" />
                                    Instagram
                                  </div>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepTwoForm.control}
                          name="platforms"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("google")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "google"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "google"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google Ads
                                  </div>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepTwoForm.control}
                          name="platforms"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("tiktok")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "tiktok"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "tiktok"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.946 6.272 6.272 0 0 1-1.17-1.847h.004c-.267-.693-.404-1.427-.41-2.168H12.27v15.011c-.023.991-.312 1.674-.778 2.102-.47.43-1.058.62-1.703.522a3.22 3.22 0 0 1-.423-.094 2.522 2.522 0 0 1-1.735-1.487 2.35 2.35 0 0 1-.132-.442 2.357 2.357 0 0 1 1.227-2.549c.424-.231.9-.335 1.376-.317.175.011.35.033.523.072V5.43c-.395-.018-.79.012-1.182.088-1.196.224-2.32.774-3.263 1.58a6.298 6.298 0 0 0-1.878 2.437 6.146 6.146 0 0 0-.515 1.987c-.048.359-.07.719-.065 1.079 0 .813.145 1.618.429 2.373a6.208 6.208 0 0 0 4.52 3.805c.387.082.778.123 1.171.123.443.003.885-.047 1.318-.149a6.555 6.555 0 0 0 2.595-1.106 6.417 6.417 0 0 0 1.875-2.245 6.27 6.27 0 0 0 .683-2.865v-5.73a8.754 8.754 0 0 0 2.895.843c.243.027.488.041.732.047V5.43a5.644 5.644 0 0 1-1.4-.293z" fill="#000000"/>
                                    </svg>
                                    TikTok
                                  </div>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepTwoForm.control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Advertising Budget</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid md:grid-cols-2 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="under1k" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Under $1,000
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="1k-5k" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              $1,000 - $5,000
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="5k-10k" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              $5,000 - $10,000
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="10k-50k" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              $10,000 - $50,000
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                            <FormControl>
                              <RadioGroupItem value="50k+" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              $50,000+
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 3: Goals & Experience */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Your marketing objectives</h1>
              <p className="text-muted-foreground">
                Tell us about your goals and experience with digital advertising.
              </p>
            </div>
            
            <Form {...stepThreeForm}>
              <form onSubmit={stepThreeForm.handleSubmit(onStepThreeSubmit)} className="space-y-6">
                <FormField
                  control={stepThreeForm.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Objectives</FormLabel>
                      <FormDescription>
                        Select all the objectives that apply to your campaigns.
                      </FormDescription>
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("brandAwareness")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "brandAwareness"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "brandAwareness"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Brand Awareness
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("leadGeneration")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "leadGeneration"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "leadGeneration"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Lead Generation
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("sales")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "sales"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "sales"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Sales & Conversions
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("engagement")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "engagement"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "engagement"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Engagement & Reach
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("retention")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "retention"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "retention"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Customer Retention
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={stepThreeForm.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("appInstalls")}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, "appInstalls"]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== "appInstalls"));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  App Installs
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepThreeForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Experience with Digital Advertising</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                            <div>
                              <FormLabel className="font-normal cursor-pointer">No Experience</FormLabel>
                              <FormDescription className="pt-1">
                                I've never run digital ad campaigns before.
                              </FormDescription>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="beginner" />
                            </FormControl>
                            <div>
                              <FormLabel className="font-normal cursor-pointer">Beginner</FormLabel>
                              <FormDescription className="pt-1">
                                I've run a few campaigns but need guidance.
                              </FormDescription>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="intermediate" />
                            </FormControl>
                            <div>
                              <FormLabel className="font-normal cursor-pointer">Intermediate</FormLabel>
                              <FormDescription className="pt-1">
                                I regularly run campaigns and have good results.
                              </FormDescription>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="expert" />
                            </FormControl>
                            <div>
                              <FormLabel className="font-normal cursor-pointer">Expert</FormLabel>
                              <FormDescription className="pt-1">
                                I'm a marketing professional with extensive experience.
                              </FormDescription>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    <User className="mr-2 h-4 w-4" />
                    Complete Setup
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
