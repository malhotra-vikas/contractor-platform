import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createSimpleToken } from "@/lib/auth"

// Mock database - replace with actual database queries
const mockUsers = [
  {
    id: "1",
    email: "admin@platform.com",
    password_hash: "$2b$10$rOzJqQqQqQqQqQqQqQqQqO", // admin123
    role: "admin",
    company_name: "Platform Admin",
    contact_person: "System Administrator",
  },
  {
    id: "2",
    email: "contractor1@example.com",
    password_hash: "$2b$10$rOzJqQqQqQqQqQqQqQqQqO", // admin123
    role: "subcontractor",
    company_name: "ABC Construction",
    contact_person: "John Smith",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email (replace with database query)
    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = createSimpleToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response with user data (excluding password)
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      contact_person: user.contact_person,
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: userData,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
