import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// This middleware automatically blocks requests without a valid Clerk jwt
export const requireStudentAuth = ClerkExpressRequireAuth();

// Simple mock coordinator auth for now (Can be upgraded later)
export const requireAdminAuth = (req, res, next) => {
    // In production, we would check for a specific Coordinator token or Clerk role.
    // We bypass this temporarily to allow easy API testing since coordinator login is presently mocked on client.
    next();
};
