
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart2, Zap, Target, Layers, ShieldCheck, RefreshCw } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-optimad-600 text-white font-bold w-10 h-10 rounded-lg flex items-center justify-center">
            OP
          </div>
          <span className="text-xl font-bold">Optimad</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-optimad-600 transition-colors">Features</a>
          <a href="#demo" className="text-sm font-medium hover:text-optimad-600 transition-colors">Demo</a>
          <a href="#pricing" className="text-sm font-medium hover:text-optimad-600 transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm font-medium hover:text-optimad-600 transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-optimad-50 to-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Automating Ad Creation & Optimization Like Never Before
            </h1>
            <p className="text-lg text-muted-foreground">
              Create and optimize ads with AI-driven automation, saving you time and money while maximizing your campaign performance.
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-optimad-600" />
                <span className="text-sm font-medium">AI-powered creation</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-optimad-600" />
                <span className="text-sm font-medium">Smart targeting</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-optimad-600" />
                <span className="text-sm font-medium">Real-time analytics</span>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/signup">
                <Button size="lg" className="rounded-full">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 animate-fade-in-up">
            <div className="relative bg-white rounded-xl shadow-glass overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Dashboard Preview" 
                className="w-full h-auto rounded-lg shadow-soft transform transition-all duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Tool?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines your advertising workflow with powerful AI-driven tools designed for performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up">
              <Zap className="h-12 w-12 text-optimad-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-muted-foreground">Seamlessly create high-converting ads in minutes with our AI assistant.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <Target className="h-12 w-12 text-optimad-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Optimization</h3>
              <p className="text-muted-foreground">AI-driven optimization algorithms that continuously improve your ad performance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <BarChart2 className="h-12 w-12 text-optimad-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">Track performance metrics in real-time to make data-driven decisions quickly.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up" style={{animationDelay: "0.3s"}}>
              <RefreshCw className="h-12 w-12 text-optimad-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">A/B Testing</h3>
              <p className="text-muted-foreground">Automatically test multiple ad variations to find the best performing content.</p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center animate-fade-in">
            <Link to="/signup">
              <Button variant="outline" size="lg" className="rounded-full group">
                Explore All Features
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="demo" className="py-24 px-4 bg-gradient-to-b from-white to-optimad-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our intuitive interface makes managing campaigns effortless across all platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="overflow-hidden rounded-xl shadow-glass group animate-fade-in-up">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                  alt="Dashboard" 
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="p-4 text-white font-medium">Intuitive Dashboard</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Comprehensive Dashboard</h3>
                <p className="text-muted-foreground text-sm">Get a bird's eye view of all your campaigns and performance metrics at a glance.</p>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-xl shadow-glass group animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Performance Analytics" 
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="p-4 text-white font-medium">Detailed Analytics</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Advanced Analytics</h3>
                <p className="text-muted-foreground text-sm">Deep insights into campaign performance with customizable reports and visualizations.</p>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-xl shadow-glass group animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                  alt="Campaign Creation" 
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="p-4 text-white font-medium">Easy Campaign Creation</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Streamlined Creation</h3>
                <p className="text-muted-foreground text-sm">Create campaigns in minutes with our intuitive workflow and AI assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible plans designed to meet your needs, from individual marketers to large enterprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Basic</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">Perfect for individuals and small businesses just getting started with ad automation.</p>
                
                <ul className="space-y-3 pt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Basic ad creation tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Limited optimization features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Standard analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Up to 5 active campaigns</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-8">
                <Link to="/signup">
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-optimad-700 to-optimad-500 p-8 rounded-xl shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-optimad-400 animate-fade-in-up relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 bg-optimad-400 text-white text-xs font-bold px-3 py-1 translate-y-1/2 -translate-x-1/4 rotate-45">
                POPULAR
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-white/80">/month</span>
                </div>
                <p className="text-white/80 text-sm">Ideal for growing businesses and marketing professionals seeking powerful tools.</p>
                
                <ul className="space-y-3 pt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <span>Advanced ad creation with AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <span>Full optimization suite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <span>A/B testing capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                    <span>Up to 20 active campaigns</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-8">
                <Link to="/signup">
                  <Button className="w-full bg-white text-optimad-600 hover:bg-white/90">Sign Up Now</Button>
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">Comprehensive solution for agencies and large businesses with advanced needs.</p>
                
                <ul className="space-y-3 pt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Everything in Pro plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Custom API integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>Unlimited active campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-optimad-600 shrink-0 mt-0.5" />
                    <span>White-labeling options</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-8">
                <Link to="/signup">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-gradient-to-b from-optimad-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't take our word for it. Here's what marketing professionals have to say about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <p className="italic text-muted-foreground mb-6">
                    "This tool has completely transformed how we manage our ad campaigns. The AI optimization helped us reduce our cost per acquisition by 37% in just two weeks."
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-optimad-100 overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/women/42.jpg" 
                      alt="Sarah Johnson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Marketing Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <p className="italic text-muted-foreground mb-6">
                    "The time savings alone are worth it. What used to take our team days now happens in hours, and the results are consistently better. The interface is intuitive and the analytics are comprehensive."
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-optimad-100 overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Michael Chen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Founder, GrowthMasters</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glass-hover transition-all duration-300 border border-gray-100 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <p className="italic text-muted-foreground mb-6">
                    "As someone who isn't very technical, I was amazed at how easy it was to create professional-looking ads that actually convert. The AI suggestions are spot on, and the platform is incredibly user-friendly."
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-optimad-100 overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/women/65.jpg" 
                      alt="Elena Rodriguez" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Elena Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Small Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-optimad-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Ad Campaigns?</h2>
            <p className="text-xl mb-8 text-white/80">
              Join thousands of marketers who are saving time and improving results with our platform.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-optimad-600 hover:bg-white/90 rounded-full">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/60">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-optimad-600 font-bold w-10 h-10 rounded-lg flex items-center justify-center">
                  OP
                </div>
                <span className="text-xl font-bold">Optimad</span>
              </div>
              <p className="text-gray-400 mb-4">
                Automating ad creation and optimization with AI technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© 2023 Optimad. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
