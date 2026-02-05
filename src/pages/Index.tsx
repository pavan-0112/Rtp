
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, CheckCircle, MessageCircle } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Building,
      title: 'Property Management',
      description: 'Manage all your properties in one centralized dashboard with detailed listings and analytics.'
    },
    {
      icon: Users,
      title: 'Tenant Management',
      description: 'Keep track of tenant information, lease agreements, and communication history.'
    },
    {
      icon: CheckCircle,
      title: 'Maintenance Tracking',
      description: 'Streamline maintenance requests and track repair progress in real-time.'
    },
    {
      icon: MessageCircle,
      title: 'AI Customer Support',
      description: 'Intelligent chatbot to help tenants with common questions and issues 24/7.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PropertyPro</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Modern Property Management
            <span className="text-blue-600 block">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your property management with our comprehensive platform. 
            Manage properties, tenants, maintenance, and more with AI-powered assistance.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/property-verification">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                Verify Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Properties
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools you need for efficient property management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of property managers who trust PropertyPro
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-6 w-6" />
            <span className="text-lg font-semibold">PropertyPro</span>
          </div>
          <p className="text-gray-400">
            © 2024 PropertyPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
