import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  role: "admin" | "subcontractor"
  company_name?: string
  contact_person?: string
}

function createSimpleToken(payload: any): string {
  const data = JSON.stringify(payload)
  const timestamp = Date.now()
  // Simple encoding without crypto dependencies
  return Buffer.from(`${data}|${timestamp}`).toString("base64")
}

function verifySimpleToken(token: string): any | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8")
    const [data, timestamp] = decoded.split("|")

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - Number.parseInt(timestamp)
    if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
      return null
    }

    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = verifySimpleToken(token)
    if (!decoded) {
      return null
    }

    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      company_name: decoded.company_name,
      contact_person: decoded.contact_person,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export function requireAuth(allowedRoles?: string[]) {
  return async (request: Request) => {
    const user = await getCurrentUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return new Response("Forbidden", { status: 403 })
    }

    return user
  }
}

export { createSimpleToken, verifySimpleToken }
