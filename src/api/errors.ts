export class EnclosedApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'EnclosedApiError';
  }
}

export class NoteNotFoundError extends EnclosedApiError {
  constructor(message: string, code?: string) {
    super(message, 404, code);
    this.name = 'NoteNotFoundError';
  }
}

export class RateLimitError extends EnclosedApiError {
  constructor(message: string, code?: string) {
    super(message, 429, code);
    this.name = 'RateLimitError';
  }
}

export class PayloadTooLargeError extends EnclosedApiError {
  constructor(message: string, code?: string) {
    super(message, 413, code);
    this.name = 'PayloadTooLargeError';
  }
}
