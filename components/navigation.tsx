"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Home, Package, MessageSquare, FileText, CreditCard, Bell, Settings, BarChart3 } from "lucide-react"

interface NavigationProps {
  userRole?: "admin" | "subcontractor"
}

export default function Navigation({ userRole = "subcontractor" }: NavigationProps) {
  const pathname = usePathname()

  const subcontractorLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/quotes", label: "Quotes", icon: FileText },
    { href: "/orders", label: "Orders", icon: CreditCard },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ]

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/quotes", label: "Quotes", icon: FileText },
    { href: "/admin/orders", label: "Orders", icon: CreditCard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ]

  const links = userRole === "admin" ? adminLinks : subcontractorLinks

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-emerald-700">
              B2B Platform
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {link.label === "Notifications" && (
                      <Badge className="bg-red-100 text-red-800 text-xs ml-1">2</Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-emerald-700 border-emerald-200">
              {userRole === "admin" ? "Admin" : "Subcontractor"}
            </Badge>
            <Link href="/settings" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
