export interface ValidationIssue {
  path: string;
  message: string;
}

export class ProtocolError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ProtocolError';
  }
}

export class AtSyntaxError extends ProtocolError {
  readonly format: string;

  constructor(message: string, format: string) {
    super(message);
    this.name = 'AtSyntaxError';
    this.format = format;
  }
}

export class ValidationError extends ProtocolError {
  readonly issues: readonly ValidationIssue[];

  constructor(issues: readonly ValidationIssue[]) {
    const detail = issues.map((issue) => (issue.path ? `${issue.path}: ${issue.message}` : issue.message)).join('\n');
    super(detail || 'Invalid AT Protocol data.');
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export class XrpcError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'XrpcError';
    this.status = status;
    this.data = data;
  }

  get errorCode(): string | undefined {
    if (!this.data || typeof this.data !== 'object' || !('error' in this.data)) return undefined;
    const code = (this.data as { error?: unknown }).error;
    return typeof code === 'string' ? code : undefined;
  }

  get retryable(): boolean {
    return this.status === 408 || this.status === 429 || this.status >= 500;
  }
}

export function isXrpcError(error: unknown): error is XrpcError {
  return error instanceof XrpcError;
}

export function isMissingRecord(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('status' in error)) return false;
  const status = (error as { status?: unknown }).status;
  return status === 400 || status === 404;
}
