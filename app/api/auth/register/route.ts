import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, company_name, contact_person, phone, address } = await request.json()

    if (!email || !password || !company_name || !contact_person) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // In a real application, you would:
    // 1. Check if user already exists in database
    // 2. Insert new user into database
    // 3. Send verification email

    console.log("New user registration:", {
      email,
      role: role || "subcontractor",
      company_name,
      contact_person,
      phone,
      address,
      password_hash,
    })

    return NextResponse.json({
      message: "Registration successful",
      user: {
        email,
        role: role || "subcontractor",
        company_name,
        contact_person,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
