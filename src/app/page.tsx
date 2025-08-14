"use client"
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Shield, BarChart3, ShoppingCart, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Home() {

  const { data: session, status } = useSession();
 // console.log(session);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/20 text-foreground font-sans">
      {/* Enhanced Navbar */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
          <Image src="/2.png" alt="SIDZ" width={100} height={40} />
          </Link>
          {/* <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">SIDDZ</span> */}
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="/buy-tenant" className="hover:text-primary transition-colors duration-200">Pricing</a>
          <a href="/reviews" className="hover:text-primary transition-colors duration-200">Reviews</a>
          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <>
              <a href="/sign-in" className="hover:text-primary transition-colors duration-200">Sign In</a>
              <a href="/sign-up" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-xl">Sign Up</a>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section with Enhanced Banner */}
      <header className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 text-center gap-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Main hero content */}
        <div className="relative z-10">
          {/* <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Star className="w-4 h-4 fill-primary" />
            Trusted by 10,000+ businesses worldwide
          </div> */}
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span>
              Supercharge
            </span>
            <br />
            <span className="text-foreground">Your Business</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Streamline sales, manage inventory, and grow your business with our all-in-one 
            <span className="font-semibold text-foreground"> Point of Sale platform</span>.
          </p>
          
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <a
          href="/sign-up"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-primary/25"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-semibold text-lg border-2 border-border hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
            >
              Watch Demo
            </a>
          </div> */}
          
          {/* Trust indicators
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div> */}
        </div>
      </header>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Active Businesses</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">$2M+</div>
              <div className="text-sm text-muted-foreground">Revenue Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your business operations and boost your bottom line
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Effortless Sales</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process transactions in seconds with our intuitive interface. Support for cash, card, and digital payments.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Inventory</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time stock tracking with automated alerts. Never run out of popular items again.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Powerful Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep insights into sales trends, customer behavior, and business performance.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Ready</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access your business from anywhere. Works seamlessly on desktop, tablet, and mobile.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage multiple users, set permissions, and track performance across your team.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level security with encrypted data, regular backups, and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Banner */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-secondary/10 via-background to-primary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Loved by Businesses Everywhere</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 bg-background rounded-2xl border border-border/50 shadow-lg">
              <div className="flex items-center gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "This POS system transformed our business. Sales are up 40% and our customers love the faster checkout experience."
              </p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-muted-foreground">Owner, Fresh Market</div>
            </div>
            
            <div className="p-6 bg-background rounded-2xl border border-border/50 shadow-lg">
              <div className="flex items-center gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The inventory management is incredible. We've reduced waste by 60% and always know what we need to reorder."
              </p>
              <div className="font-semibold">Mike Chen</div>
              <div className="text-sm text-muted-foreground">Manager, Tech Store</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      {/* <section id="pricing" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Choose the plan that fits your business. All plans include our core features.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 rounded-2xl border-2 border-border/50 bg-gradient-to-br from-background to-secondary/5">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="text-4xl font-bold text-primary mb-2">$29</div>
              <div className="text-muted-foreground mb-6">per month</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Up to 1,000 transactions/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Basic inventory management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>
              <a
                href="/sign-up"
                className="w-full inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </a>
            </div>
            
            <div className="p-8 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="text-4xl font-bold text-primary mb-2">$79</div>
              <div className="text-muted-foreground mb-6">per month</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Multi-location support</span>
                </li>
              </ul>
              <a
                href="/sign-up"
                className="w-full inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Banner */}
      {/* <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using our platform to grow and succeed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/sign-up"
              className="group inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section> */}

      {/* Enhanced Footer */}
      <footer className="py-12 border-t border-border bg-background/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">POS SaaS</span>
              </div>
              <p className="text-muted-foreground">
                The complete point-of-sale solution for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/buy-tenant" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/reviews" className="hover:text-foreground transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} POS SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
