type BaseErrorCreationAttrs = {
  /** Original error that triggered this wrapper error. */
  original?: Error;

  /** A human-readable description of the error. */
  message?: string;
};

export type RecaptchaErrorCreationAttrs = BaseErrorCreationAttrs;

export class RecaptchaError
  extends Error
  implements RecaptchaErrorCreationAttrs
{
  original?: Error;

  constructor(attrs: RecaptchaErrorCreationAttrs) {
    super(attrs.message);

    this.original = attrs.original;
  }
}

type APIErrorCreationAttrs = BaseErrorCreationAttrs;

export class RecaptchaAPIError
  extends RecaptchaError
  implements APIErrorCreationAttrs
{
  type: 'api-error';

  constructor(attrs: APIErrorCreationAttrs = {}) {
    super(attrs);

    this.type = 'api-error';
  }
}

type ConnectionErrorCreationAttrs = BaseErrorCreationAttrs;

export class RecaptchaConnectionError
  extends RecaptchaError
  implements ConnectionErrorCreationAttrs
{
  type: 'connection-error';

  constructor(attrs: ConnectionErrorCreationAttrs = {}) {
    super(attrs);

    this.type = 'connection-error';
  }
}

type InvalidRequestErrorCreationAttrs = BaseErrorCreationAttrs;

export class RecaptchaInvalidRequestError
  extends RecaptchaError
  implements InvalidRequestErrorCreationAttrs
{
  type: 'invalid-request-error';

  constructor(attrs: InvalidRequestErrorCreationAttrs = {}) {
    super(attrs);

    this.type = 'invalid-request-error';
  }
}
