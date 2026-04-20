export function getClientIp(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

export function sanitizeBody(body: any) {
  if (!body) return body;

  const cloned = { ...body };

  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken'];

  for (const field of sensitiveFields) {
    if (cloned[field]) cloned[field] = '***';
  }

  return cloned;
}