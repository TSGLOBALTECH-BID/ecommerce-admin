// User data that comes with the login response
export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string; // e.g., 'admin', 'user'
  // Add other user fields as needed
}