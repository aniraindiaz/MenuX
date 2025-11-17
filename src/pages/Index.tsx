import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Settings, Zap, Shield, BarChart3, Store, Globe, QrCode, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
              MenuX
            </span>{" "}
            <span className="text-foreground">— Modern QR Menus</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Launch digital menus in minutes. Engage customers. Get insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" size="lg" className="text-base px-8">
                View Menu
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span>Trusted by 1,000+ restaurants across India</span>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">View Menu</h3>
              <p className="text-muted-foreground">
                Browse our current menu as a customer
              </p>
              <Link to="/menu">
                <Button className="w-full" size="lg">
                  View Menu
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Settings className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Admin Access</h3>
              <p className="text-muted-foreground">
                Manage menu items and settings
              </p>
              <Link to="/auth">
                <Button className="w-full" size="lg" variant="secondary">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { num: "1", title: "Print or Display", desc: "Click 'Print' to print QR codes for each table, or 'Download' to save as an image for digital display" },
              { num: "2", title: "Place on Tables", desc: "Position the QR code on each table or at the bar entrance for easy customer access" },
              { num: "3", title: "Customers Scan", desc: "Customers scan the code with their phone camera to instantly access the digital menu" },
              { num: "4", title: "Browse & Order", desc: "Customers can browse items, add to cart, and place orders directly from their device" },
            ].map((step) => (
              <div key={step.num} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground mx-auto flex items-center justify-center text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Setup", desc: "Create menus and QR codes in minutes", color: "text-primary" },
              { icon: Shield, title: "Secure & Reliable", desc: "Built on Lovable Cloud with RLS", color: "text-accent" },
              { icon: BarChart3, title: "Analytics", desc: "Track scans, engagement, and top items", color: "text-secondary" },
              { icon: Store, title: "Multi-Location", desc: "Manage menus across outlets", color: "text-primary" },
              { icon: Globe, title: "Multi-language", desc: "Serve customers in their language", color: "text-accent" },
              { icon: QrCode, title: "Beautiful QR", desc: "Brand-safe QR codes and landing", color: "text-secondary" },
            ].map((feature) => (
              <Card key={feature.title} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2024 MenuX. Built with Lovable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
