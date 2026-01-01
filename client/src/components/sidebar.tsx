import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  Clock, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Devices", href: "/admin/devices", icon: Monitor },
  { name: "Prayer Times", href: "/admin/prayer-times", icon: Clock },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

// Remove unused settings navigation as we have Settings in main nav

export default function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-hide functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 3000); // Auto-collapse after 3 seconds

    return () => clearTimeout(timer);
  }, [location]); // Reset timer when navigating to new page

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin" || location === "/";
    }
    return location.startsWith(href);
  };

  const sidebarWidth = (isCollapsed && !isHovered) ? 'w-16' : 'w-64';
  const shouldShowText = !isCollapsed || isHovered;

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-white shadow-lg transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">☪</span>
          </div>
          {shouldShowText && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Athaan Fi Beit</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          )}
        </div>
        {shouldShowText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {!shouldShowText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 ml-auto"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer relative
                  ${active 
                    ? 'bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}>
                  <Icon className={`${shouldShowText ? 'mr-3' : 'mx-auto'} h-5 w-5 ${active ? 'text-emerald-500' : 'text-gray-400'}`} />
                  {shouldShowText && (
                    <>
                      {item.name}
                      {item.name === "Users" && (
                        <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          0
                        </span>
                      )}
                      {item.name === "Devices" && (
                        <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          0
                        </span>
                      )}
                    </>
                  )}
                  {!shouldShowText && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <a 
            href="/api/logout"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 relative"
          >
            <LogOut className={`${shouldShowText ? 'mr-3' : 'mx-auto'} h-5 w-5 text-red-500`} />
            {shouldShowText && "Logout"}
            {!shouldShowText && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Logout
              </div>
            )}
          </a>
        </div>
      </nav>

      {/* User Profile Section */}
      {shouldShowText && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@athaan.com</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-gray-400 hover:text-gray-600"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
