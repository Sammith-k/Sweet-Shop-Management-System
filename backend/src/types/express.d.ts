declare global {
  type Role = 'USER' | 'ADMIN';

  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: Role;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}