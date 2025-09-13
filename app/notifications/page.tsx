"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Clock, DollarSign, Package, MessageSquare, AlertCircle } from "lucide-react"

interface Notification {
  id: string
  type: "quote_response" | "payment_due" | "order_update" | "message" | "system"
  title: string
  message: string
  created_at: string
  read: boolean
  action_url?: string
  priority: "low" | "medium" | "high"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "quote_response",
        title: "Quote Response Received",
        message: "Your quote request for Steel Beams has been responded to with pricing information.",
        created_at: "2024-01-15T10:30:00Z",
        read: false,
        action_url: "/quotes",
        priority: "high",
      },
      {
        id: "2",
        type: "payment_due",
        title: "Payment Due Reminder",
        message: "Final payment of $3,500 is due for Order #ORD-002. The order has been delivered.",
        created_at: "2024-01-14T15:45:00Z",
        read: false,
        action_url: "/orders/ORD-002/payment",
        priority: "high",
      },
      {
        id: "3",
        type: "order_update",
        title: "Order Status Update",
        message: "Order #ORD-001 has been shipped and is on its way to your location.",
        created_at: "2024-01-13T09:15:00Z",
        read: true,
        action_url: "/orders/ORD-001",
        priority: "medium",
      },
      {
        id: "4",
        type: "message",
        title: "New Message",
        message: "You have received a new message from John Smith regarding your recent quote.",
        created_at: "2024-01-12T14:20:00Z",
        read: true,
        action_url: "/messages",
        priority: "medium",
      },
      {
        id: "5",
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur on Sunday, January 21st from 2:00 AM to 4:00 AM EST.",
        created_at: "2024-01-11T08:00:00Z",
        read: true,
        priority: "low",
      },
    ]
    setNotifications(mockNotifications)
  }, [])

  const filteredNotifications = notifications.filter((notification) => filter === "all" || !notification.read)

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quote_response":
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case "payment_due":
        return <DollarSign className="h-5 w-5 text-red-600" />
      case "order_update":
        return <Package className="h-5 w-5 text-emerald-600" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      default:
        return <Bell className="h-5 w-5 text-slate-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-slate-100 text-slate-800 border-slate-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
              <p className="text-slate-600">Stay updated with your business activities</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && <Badge className="bg-red-100 text-red-800">{unreadCount} unread</Badge>}
              <Button onClick={markAllAsRead} variant="outline" size="sm" disabled={unreadCount === 0}>
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
              All ({notifications.length})
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")} size="sm">
              Unread ({unreadCount})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
                <p className="text-slate-600">
                  {filter === "unread"
                    ? "All caught up! No unread notifications."
                    : "You have no notifications at this time."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-emerald-500 bg-emerald-50" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-slate-700 mb-3">{notification.message}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="h-4 w-4" />
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                            {notification.action_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                              >
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
