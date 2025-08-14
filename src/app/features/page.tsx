"use client"
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Shield, BarChart3, ShoppingCart, Smartphone, CreditCard, Database, Zap, Globe, Lock, Barcode, Receipt, PieChart, Bell, Calendar, FileText, Settings, HeadphonesIcon } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 text-foreground font-sans">
      {/* Navbar */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
          <Image src="/2.png" alt="SIDZ" width={100} height={40} />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/features" className="text-primary">Features</a>
          <a href="/buy-tenant" className="hover:text-primary transition-colors duration-200">Pricing</a>
          <a href="/reviews" className="hover:text-primary transition-colors duration-200">Reviews</a>
          <a href="/sign-in" className="hover:text-primary transition-colors duration-200">Sign In</a>
          <a href="/sign-up" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-xl">Sign Up</a>
        </div>
      </nav>

      {/* Header */}
      <header className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Star className="w-4 h-4 fill-primary" />
            Powerful Features for Modern Businesses
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-foreground">to Succeed</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the comprehensive features that make our POS system the ultimate solution for businesses of all sizes.
          </p>
        </div>
      </header>

      {/* Core Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core POS Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential tools that power your daily operations
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Point of Sale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lightning-fast checkout with support for cash, credit cards, mobile payments, and gift cards.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple payment methods</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Quick product search</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Discounts & promotions</span>
                </li>
              </ul>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inventory Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete control over your stock with real-time tracking and automated alerts.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time stock levels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Barcode scanning</span>
                </li>
              </ul>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build lasting relationships with comprehensive customer profiles and loyalty programs.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Customer profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Purchase history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Loyalty rewards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 via-background to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take your business to the next level with powerful advanced features
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Deep insights into sales trends, customer behavior, and business performance with customizable reports.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Multi-Location Support</h3>
                  <p className="text-muted-foreground">
                    Manage multiple stores from a single dashboard with centralized control and reporting.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Automation & Workflows</h3>
                  <p className="text-muted-foreground">
                    Automate repetitive tasks and create custom workflows to streamline your operations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Processing</h3>
                  <p className="text-muted-foreground">
                    Secure payment processing with support for all major credit cards and digital wallets.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Data Backup & Sync</h3>
                  <p className="text-muted-foreground">
                    Automatic cloud backup and real-time synchronization across all your devices and locations.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                  <p className="text-muted-foreground">
                    Bank-level security with encrypted data, role-based access control, and compliance standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Integration Features */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Mobile & Integration</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access your business from anywhere and connect with the tools you already use
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="text-muted-foreground leading-relaxed">
                Full-featured mobile app for iOS and Android with offline capabilities and push notifications.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
                              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Barcode className="w-7 h-7 text-primary" />
                </div>
              <h3 className="text-xl font-semibold mb-3">Hardware Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamlessly integrate with barcode scanners, receipt printers, cash drawers, and more.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Settings className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Third-Party Apps</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with accounting software, e-commerce platforms, and other business tools via API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting & Analytics */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Reporting & Analytics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Make data-driven decisions with comprehensive reporting and real-time insights
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sales Reports</h3>
              <p className="text-sm text-muted-foreground">
                Daily, weekly, monthly, and yearly sales performance with trend analysis
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Inventory Reports</h3>
              <p className="text-sm text-muted-foreground">
                Stock levels, turnover rates, and reorder recommendations
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Customer behavior, preferences, and lifetime value analysis
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Employee performance, productivity, and efficiency tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free trial today and see how our comprehensive feature set can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/sign-up"
              className="group inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a
              href="/reviews"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              Read Customer Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
