
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";

const userFormSchema = z.object({
  organization: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  role: z.string().min(1, "Role is required"),
  marketingGoals: z.string().min(1, "Marketing goals are required"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Onboarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      organization: "",
      industry: "",
      role: "",
      marketingGoals: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      console.log('Submitting onboarding data:', data);
      
      // Submit user profile data to backend
      await api.post('/users/profile', data);
      
      toast({
        title: "Onboarding complete",
        description: "Your profile has been set up successfully",
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        console.log('Navigating to dashboard after onboarding');
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        variant: "destructive",
        title: "Failed to complete onboarding",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Complete Your Profile
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Your organization name" {...field} />
                </FormControl>
                <FormDescription>
                  This is how others will identify you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  What industry does your organization operate in?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Your role in the organization" {...field} />
                </FormControl>
                <FormDescription>
                  What is your role in the organization?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketing Goals</FormLabel>
                <FormControl>
                  <Input placeholder="Your primary marketing goals" {...field} />
                </FormControl>
                <FormDescription>
                  What are your primary marketing goals?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Complete Setup"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Onboarding;
