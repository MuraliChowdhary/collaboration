export const API_GATEWAY_CONFIG = {
  baseUrl: "/api/v1",
  services: {
    auth: {
      url: "http://localhost:3001",
      prefix: "/auth",
      routes: ["/register", "/login", "/logout", "/refresh", "/forgot-password", "/reset-password", "/verify-email"]
    },
    user: {
      url: "http://localhost:3002",
      prefix: "/users",
      routes: ["/me", "/me/skills", "/me/interests", "/me/settings", "/search", "/suggestions", "/:id", "/:id/stats"]
    },
    project: {
      url: "http://localhost:3003",
      prefix: "/projects",
      routes: ["/", "/:id", "/:id/members", "/:id/milestones", "/:id/invites", "/featured", "/trending"]
    },
    collaboration: {
      url: "http://localhost:3004",
      prefix: "/messages",
      routes: ["/", "/:id", "/conversations", "/upload"],
      websocket: true,
      socketUrl: "ws://localhost:3004"
    },
    notification: {
      url: "http://localhost:3005",
      prefix: "/notifications",
      routes: ["/", "/:id/read", "/read-all", "/preferences"]
    }
  },
  middleware: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true
    },
    authentication: {
      excludedRoutes: [
        "/auth/register",
        "/auth/login",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/health"
      ]
    }
  }
};