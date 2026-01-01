import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  sidebarWidth: string;
  contentMargin: string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const sidebarWidth = (isCollapsed && !isHovered) ? 'w-16' : 'w-64';
  const contentMargin = (isCollapsed && !isHovered) ? 'pl-16' : 'pl-64';

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      setIsCollapsed,
      isHovered,
      setIsHovered,
      sidebarWidth,
      contentMargin
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}