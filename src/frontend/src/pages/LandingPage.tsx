import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, Users, Calendar } from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Asistenku</h1>
              <p className="text-xs text-muted-foreground">Service Management Platform</p>
            </div>
          </div>
          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="bg-primary hover:bg-primary/90"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Manage Your Service Subscriptions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform for managing service subscriptions, clients, and Asistenmu assignments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleLogin}
                disabled={loginStatus === 'logging-in'}
                className="bg-primary hover:bg-primary/90 text-lg px-8"
              >
                <Shield className="w-5 h-5 mr-2" />
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Get Started'}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Create, edit, and track service subscriptions with flexible date ranges and pricing.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Client & Asistenmu</CardTitle>
                  <CardDescription>
                    Assign Asistenmu to subscriptions and manage shared access for multiple users.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Advanced Filtering</CardTitle>
                  <CardDescription>
                    Filter subscriptions by service type, status, date range, and quantity with pagination.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with{' '}
            <span className="inline-block text-red-500 animate-pulse">♥</span>{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
