"use client"
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, Quote, TrendingUp, Users, ShoppingCart, Heart, Award, Zap, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function ReviewsPage() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Owner",
      company: "Fresh Market",
      rating: 5,
      review: "This POS system transformed our business. Sales are up 40% and our customers love the faster checkout experience. The inventory management is incredible - we've reduced waste by 60% and always know what we need to reorder.",
      avatar: "/logo.png",
      industry: "Retail",
      location: "New York, NY",
      improvement: "40% sales increase"
    },
    {
      name: "Mike Chen",
      role: "Manager",
      company: "Tech Store",
      rating: 5,
      review: "The inventory management is incredible. We've reduced waste by 60% and always know what we need to reorder. The reporting features give us insights we never had before.",
      avatar: "/logo.png",
      industry: "Electronics",
      location: "San Francisco, CA",
      improvement: "60% waste reduction"
    },
    {
      name: "Emily Rodriguez",
      role: "Owner",
      company: "Bella Boutique",
      rating: 5,
      review: "Customer management is a game-changer. We can track preferences, send personalized offers, and build loyalty like never before. Our repeat customers have increased by 35%.",
      avatar: "/logo.png",
      industry: "Fashion",
      location: "Miami, FL",
      improvement: "35% repeat customers"
    },
    {
      name: "David Kim",
      role: "Operations Director",
      company: "Urban Coffee Co.",
      rating: 5,
      review: "The mobile app is fantastic. Our baristas can take orders from anywhere in the store, and the real-time sync means no more lost orders. Customer satisfaction scores are through the roof.",
      avatar: "/logo.png",
      industry: "Food & Beverage",
      location: "Seattle, WA",
      improvement: "95% customer satisfaction"
    },
    {
      name: "Lisa Thompson",
      role: "Store Manager",
      company: "Home Essentials",
      rating: 5,
      review: "Multi-location support is exactly what we needed. Managing 5 stores from one dashboard saves us hours every week. The centralized reporting gives us a complete picture of our business.",
      avatar: "/logo.png",
      industry: "Home & Garden",
      location: "Chicago, IL",
      improvement: "80% time savings"
    },
    {
      name: "James Wilson",
      role: "CEO",
      company: "Fitness Gear Pro",
      rating: 5,
      review: "The analytics and reporting features are incredible. We can see exactly which products are performing best, track customer behavior, and make data-driven decisions. Revenue is up 50% since implementation.",
      avatar: "/logo.png",
      industry: "Sports & Fitness",
      location: "Austin, TX",
      improvement: "50% revenue increase"
    }
  ];

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "98%", label: "Customer Satisfaction", icon: Heart },
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "99.9%", label: "Uptime", icon: TrendingUp }
  ];

  const industries = [
    { name: "Retail", count: 45, icon: ShoppingCart },
    { name: "Food & Beverage", count: 32, icon: Heart },
    { name: "Electronics", count: 28, icon: Zap },
    { name: "Fashion", count: 25, icon: Users },
    { name: "Home & Garden", count: 22, icon: Globe },
    { name: "Sports & Fitness", count: 18, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 text-foreground font-sans">
      <Navbar />

      {/* Header */}
      <header className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Star className="w-4 h-4 fill-primary" />
            Trusted by 10,000+ Businesses
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Loved by Businesses
            </span>
            <br />
            <span className="text-foreground">Everywhere</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See what our customers are saying about how our POS system has transformed their businesses and helped them grow.
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Customer Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real businesses, real results. Discover how our POS system is driving growth and success.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <div key={index} className="group p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-background to-secondary/5">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={32} 
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{testimonial.industry}</span>
                  <span className="text-primary font-medium">{testimonial.improvement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Success */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 via-background to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Across Industries</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our POS system works for businesses of all types and sizes
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, index) => (
              <div key={index} className="group p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-background">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <industry.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{industry.name}</h3>
                    <p className="text-sm text-muted-foreground">{industry.count} success stories</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">In Their Own Words</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Detailed stories from business owners who've experienced transformation
            </p>
          </div>
          
          <div className="space-y-12">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-secondary/5">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-lg text-muted-foreground italic mb-6 leading-relaxed">
                  "{testimonial.review}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        width={40} 
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{testimonial.improvement}</div>
                    <div className="text-sm text-muted-foreground">Improvement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Businesses Choose Us</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-sm text-muted-foreground">
                Thousands of businesses have achieved measurable improvements in sales, efficiency, and customer satisfaction.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reliable Support</h3>
              <p className="text-sm text-muted-foreground">
                Our dedicated support team is here to help you succeed with 24/7 assistance and comprehensive training.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We constantly update our platform with new features and improvements based on customer feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Success Stories</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free trial today and see why thousands of businesses choose our POS system.
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
              href="/features"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              Explore Features
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
