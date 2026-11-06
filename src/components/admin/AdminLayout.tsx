// Admin layout with dark theme (discreet blue/purple accents)
import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Globe, DollarSign, Settings, LogOut, Sparkles } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/adm" className="text-lg font-bold text-blue-400">
                i-Tools Admin
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/adm/seo" className="flex items-center gap-2 text-sm text-primary hover:underline"><Sparkles className="w-4 h-4" />SEO com IA</Link>
                <Link 
                  to="/adm" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/adm/countries" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Geography
                </Link>
                <Link 
                  to="/adm/monetag" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Monetag
                </Link>
                <Link 
                  to="/adm/tools" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Tools
                </Link>
              </div>
            </div>
            <Link 
              to="/adm/logout" 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </div>
        </div>
      </nav>
      <div className="md:hidden border-b border-border px-4 py-3"><Link to="/adm/seo" className="inline-flex items-center gap-2 text-sm text-primary"><Sparkles className="w-4 h-4" />SEO com IA</Link></div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
