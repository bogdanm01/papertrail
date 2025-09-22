declare namespace Express {
  interface Request {
    auth: {
      userId: string;
      sessionId: string;
      jti?: string;
    };
  }
}
