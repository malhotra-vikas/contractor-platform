"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Send, MessageSquare, Clock } from "lucide-react"

interface Message {
  id: string
  sender_id: string
  sender_name: string
  sender_role: "admin" | "subcontractor"
  recipient_id: string
  recipient_name: string
  subject: string
  content: string
  created_at: string
  read: boolean
  order_id?: string
  quote_id?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipient_id: "",
    subject: "",
    content: "",
  })

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMessages: Message[] = [
      {
        id: "1",
        sender_id: "2",
        sender_name: "John Smith",
        sender_role: "admin",
        recipient_id: "1",
        recipient_name: "Current User",
        subject: "Quote #QT-001 - Steel Beams Available",
        content:
          "Good news! The steel beams you requested are available. We can offer them at $850 per ton with delivery in 5-7 business days. Please let me know if you'd like to proceed with the order.",
        created_at: "2024-01-15T10:30:00Z",
        read: false,
        quote_id: "QT-001",
      },
      {
        id: "2",
        sender_id: "3",
        sender_name: "Mike Johnson",
        sender_role: "subcontractor",
        recipient_id: "1",
        recipient_name: "Current User",
        subject: "Payment Confirmation - Order #ORD-001",
        content:
          "I have made the partial payment of $5,000 for order #ORD-001. Please confirm receipt and let me know the expected delivery date.",
        created_at: "2024-01-14T15:45:00Z",
        read: true,
        order_id: "ORD-001",
      },
      {
        id: "3",
        sender_id: "2",
        sender_name: "John Smith",
        sender_role: "admin",
        recipient_id: "1",
        recipient_name: "Current User",
        subject: "Order Delivered - Final Payment Request",
        content:
          "Your order #ORD-002 has been successfully delivered. Please inspect the materials and process the remaining payment of $3,500 at your earliest convenience.",
        created_at: "2024-01-13T09:15:00Z",
        read: true,
        order_id: "ORD-002",
      },
    ]
    setMessages(mockMessages)
  }, [])

  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    // Mock sending - replace with actual API call
    console.log("Sending message:", newMessage)
    setIsComposing(false)
    setNewMessage({ recipient_id: "", subject: "", content: "" })
  }

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Communicate with your business partners</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Inbox</CardTitle>
                  <Button
                    onClick={() => setIsComposing(true)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Compose
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.read) markAsRead(message.id)
                      }}
                      className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                        !message.read ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {message.sender_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-slate-900 truncate">{message.sender_name}</p>
                            <Badge
                              variant={message.sender_role === "admin" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {message.sender_role}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm text-slate-900 truncate mb-1">{message.subject}</p>
                          <p className="text-xs text-slate-600 truncate">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            {isComposing ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Compose Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Recipient</label>
                    <Input
                      placeholder="Enter recipient email or name"
                      value={newMessage.recipient_id}
                      onChange={(e) => setNewMessage((prev) => ({ ...prev, recipient_id: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <Input
                      placeholder="Enter subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <Textarea
                      placeholder="Type your message here..."
                      rows={8}
                      value={newMessage.content}
                      onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={() => setIsComposing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {selectedMessage.sender_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{selectedMessage.sender_name}</h3>
                          <Badge variant={selectedMessage.sender_role === "admin" ? "default" : "secondary"}>
                            {selectedMessage.sender_role}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {(selectedMessage.order_id || selectedMessage.quote_id) && (
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                        {selectedMessage.order_id
                          ? `Order: ${selectedMessage.order_id}`
                          : `Quote: ${selectedMessage.quote_id}`}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mt-4">{selectedMessage.subject}</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <Button onClick={() => setIsComposing(true)} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No message selected</h3>
                  <p className="text-slate-600">Choose a message from the inbox to read it</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
