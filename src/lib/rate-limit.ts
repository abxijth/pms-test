import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let ratelimit: Ratelimit | null = null

function getRatelimit() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  }
  return ratelimit
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit()
  if (!limiter) return { success: true, remaining: 999 }

  const result = await limiter.limit(identifier)
  return { success: result.success, remaining: result.remaining }
}
