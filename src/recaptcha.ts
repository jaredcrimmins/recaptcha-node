import {Agent} from 'https';
import {RecaptchaV2Result, RecaptchaV3Result} from './recaptcha-result';
import {ClientOptions, request} from './client';
import {URLSearchParams} from 'url';

export type SupportedProtocols = 'https' | 'http';

export type RecaptchaOptions = {
  httpAgent?: Agent;

  /** The hostname that the client connects to. */
  hostname?: string;
  port?: number | string;
  protocol?: SupportedProtocols;

  /** Milliseconds before a request times out. */
  timeout?: number;
};

abstract class Recaptcha implements RecaptchaOptions {
  private _protocol: SupportedProtocols;
  httpAgent?: Agent;
  hostname?: string;
  port?: number | string;
  timeout?: number;
  secretKey: string;

  /**
   *
   * @param {string} secretKey - The secret key used for communication between
   * your site and reCAPTCHA.
   */
  constructor(secretKey: string, options: RecaptchaOptions = {}) {
    if (typeof secretKey !== 'string') {
      throw new Error('A secret key must be provided.');
    }

    this._protocol = 'https';
    this.httpAgent = options.httpAgent;
    this.hostname = options.hostname || 'google.com';
    this.protocol = options.protocol || 'https';
    this.timeout = options.timeout;
    this.secretKey = secretKey;

    if (options.port) this.port = options.port;
    else this.port = this.protocol === 'https' ? 443 : 80;
  }

  set protocol(value) {
    if (value !== 'http' && value !== 'https') {
      throw new Error(
        `Protocol ${value} not supported. Expected "http" or "https"`
      );
    }

    this._protocol = value;
  }

  get protocol() {
    return this._protocol;
  }

  _getData(responseToken: string, remoteIP?: string) {
    const searchParams = new URLSearchParams({
      secret: this.secretKey,
      response: responseToken,
      remoteip: remoteIP || '',
    });

    return searchParams.toString();
  }

  _getClientOptions(responseToken: string, remoteIP?: string): ClientOptions {
    return {
      hostname: this.hostname,
      agent: this.httpAgent,
      port: this.port,
      protocol: this.protocol,
      path: '/recaptcha/api/siteverify',
      data: this._getData(responseToken, remoteIP),
      timeout: this.timeout,
    };
  }

  _request(responseToken: string, remoteIP?: string) {
    const options = this._getClientOptions(responseToken, remoteIP);

    return request(options);
  }
}

export class RecaptchaV2 extends Recaptcha {
  /**
   * Verify the reCAPTCHA v2 response token received from the client.
   * @param {string} responseToken - The user response token provided by the
   * reCAPTCHA client-side integration on your site.
   * @param {string} [remoteIP] - The user's IP address.
   */
  verify(responseToken: string, remoteIP?: string): Promise<RecaptchaV2Result> {
    return this._request(responseToken, remoteIP).then(rawResult => {
      return new RecaptchaV2Result(rawResult);
    });
  }
}

export class RecaptchaV3 extends Recaptcha {
  /**
   * Verify the reCAPTCHA v3 response token received from the client.
   * @param {string} responseToken - The user response token provided by the
   * reCAPTCHA client-side integration on your site.
   * @param {string} [remoteIP] - The user's IP address.
   */
  verify(responseToken: string, remoteIP?: string): Promise<RecaptchaV3Result> {
    return this._request(responseToken, remoteIP).then(rawResult => {
      return new RecaptchaV3Result(rawResult);
    });
  }
}
