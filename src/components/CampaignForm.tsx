
import { useState } from "react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const campaignFormSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters" }),
  objective: z.enum(["awareness", "consideration", "conversion"], {
    required_error: "Please select an objective",
  }),
  platform: z.enum(["facebook", "instagram", "both"], {
    required_error: "Please select a platform",
  }),
  budgetType: z.enum(["daily", "lifetime"], {
    required_error: "Please select a budget type",
  }),
  budget: z.number().min(5, { message: "Budget must be at least $5" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  targeting: z.object({
    locations: z.array(z.string()).min(1, { message: "At least one location is required" }),
    ageMin: z.number().min(13, { message: "Minimum age must be at least 13" }).max(65),
    ageMax: z.number().min(13).max(65, { message: "Maximum age must be at most 65" }),
    gender: z.enum(["all", "male", "female"]),
    interests: z.array(z.string()).optional(),
  }),
  adCreative: z.object({
    headline: z.string().min(3, { message: "Headline must be at least 3 characters" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters" }),
    primaryText: z.string().min(3, { message: "Primary text must be at least 3 characters" }),
    callToAction: z.string().min(3, { message: "Call to action must be at least 3 characters" }),
  }),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

const CampaignForm = () => {
  const [currentTab, setCurrentTab] = useState("basic");
  
  const defaultValues: Partial<CampaignFormValues> = {
    objective: "consideration",
    platform: "both",
    budgetType: "daily",
    budget: 50,
    targeting: {
      locations: ["United States"],
      ageMin: 18,
      ageMax: 65,
      gender: "all",
      interests: [],
    },
  };

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  function onSubmit(data: CampaignFormValues) {
    console.log(data);
    
    toast({
      title: "Campaign created",
      description: "Your campaign has been created successfully and is now processing.",
    });
    
    // Here we would normally send the data to the server
    // In a real implementation, we would integrate with Facebook Marketing API
  }

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
              <TabsTrigger value="creative">Ad Creative</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium">Campaign Details</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the basic information about your campaign
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Sale 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Objective</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an objective" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="consideration">Consideration</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What is the primary goal of this campaign?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <h3 className="text-lg font-medium">Delivery Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure where and when your campaign will run
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="facebook" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Facebook
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="instagram" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Instagram
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="both" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Both
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <h3 className="text-lg font-medium">Budget & Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Set your campaign budget and schedule
                </p>
              </div>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Budget Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="daily" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Daily
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="lifetime" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Lifetime
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50" 
                          min={5}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setCurrentTab("targeting")}
                >
                  Next: Targeting
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="targeting" className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium">Audience Targeting</h3>
                <p className="text-sm text-muted-foreground">
                  Define who will see your ads
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="targeting.locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locations</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="United States" 
                        value={field.value?.join(", ")} 
                        onChange={(e) => 
                          field.onChange(e.target.value.split(",").map(item => item.trim()))
                        } 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter locations separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="text-lg font-medium">Demographics</h3>
                <p className="text-sm text-muted-foreground">
                  Target specific demographic groups
                </p>
              </div>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targeting.ageMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={13} 
                          max={65}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targeting.ageMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={13} 
                          max={65}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="targeting.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="text-lg font-medium">Interests & Behaviors</h3>
                <p className="text-sm text-muted-foreground">
                  Target users based on their interests and online behaviors
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="targeting.interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Travel, Technology, Fashion" 
                        value={field.value?.join(", ") || ""} 
                        onChange={(e) => 
                          field.onChange(
                            e.target.value ? 
                              e.target.value.split(",").map(item => item.trim()) : 
                              []
                          )
                        } 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter interests separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentTab("basic")}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setCurrentTab("creative")}
                >
                  Next: Ad Creative
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="creative" className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium">Ad Content</h3>
                <p className="text-sm text-muted-foreground">
                  Create compelling ad content for your campaign
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="adCreative.headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Sale - Up to 50% Off" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum 40 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adCreative.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Limited time offer on all summer items" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum 125 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adCreative.primaryText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Get ready for summer with our exclusive collection. Limited time offer with free shipping on all orders." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 125 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="text-lg font-medium">Call to Action</h3>
                <p className="text-sm text-muted-foreground">
                  Define what action you want users to take
                </p>
              </div>
              <Separator />
              
              <FormField
                control={form.control}
                name="adCreative.callToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call To Action</FormLabel>
                    <FormControl>
                      <Input placeholder="Shop Now" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentTab("targeting")}
                >
                  Back
                </Button>
                <Button type="submit">Create Campaign</Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default CampaignForm;
