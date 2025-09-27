import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Gamepad2,
  MessageSquareText,
  Crown,
  User,
  LogOut,
  Home
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Palabras", url: "/words", icon: MessageSquareText },
  { title: "Juegos", url: "/games", icon: Gamepad2 },
  { title: "Verbos Frasales", url: "/phrasal-verbs", icon: BookOpen },
  { title: "Premium", url: "/premium", icon: Crown },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          {state === "expanded" && (
            <span className="text-xl font-bold text-primary">
              VocabSpark
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {state === "expanded" && <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/profile" className={getNavCls}>
                <User className="h-4 w-4" />
                {state === "expanded" && <span>Perfil</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              {state === "expanded" && <span className="ml-2">Cerrar Sesión</span>}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}