
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Reset password for:", data);
      
      toast({
        title: "Reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      
      setResetSent(true);
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error sending the reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-optimad-600 to-optimad-800 bg-clip-text text-transparent"
            >
              Optimad
            </Link>
            
            {resetSent ? (
              <>
                <div className="flex flex-col items-center justify-center mt-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                    Check your email
                  </h2>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    We've sent a password reset link to {form.getValues().email}.
                    Please check your email and follow the instructions.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link to="/login">
                        Return to login
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                  Reset your password
                </h2>
                <p className="mt-2 text-sm text-center text-muted-foreground">
                  Enter your email and we'll send you a link to reset your password.
                </p>

                <div className="mt-8 w-full">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                type="email" 
                                {...field} 
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <KeyRound className="mr-2 h-4 w-4" />
                            Send Reset Link
                          </span>
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <Link
                          to="/login"
                          className="font-medium text-optimad-600 hover:text-optimad-500 text-sm"
                        >
                          Back to login
                        </Link>
                      </div>
                    </form>
                  </Form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-optimad-600 to-optimad-800" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
          <KeyRound className="h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Password Reset</h2>
          <p className="text-center max-w-md">
            Don't worry, it happens to the best of us. Enter your email and we'll 
            send you instructions to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
