// Simple rate limiter for security
interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private maxRequests = 10
  private windowMs = 60000 // 1 minute

  check(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // Clean up expired entries
    if (entry && entry.resetAt < now) {
      this.limits.delete(identifier)
    }

    const current = this.limits.get(identifier)

    if (!current) {
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      })
      return { allowed: true, remaining: this.maxRequests - 1 }
    }

    if (current.count >= this.maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    current.count++
    return { allowed: true, remaining: this.maxRequests - current.count }
  }

  reset(identifier: string): void {
    this.limits.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()
