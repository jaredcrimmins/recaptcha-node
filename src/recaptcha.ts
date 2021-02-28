import {Agent} from 'https';
import {RecaptchaConnectionError} from './errors';
import {RecaptchaV2Result, RecaptchaV3Result} from './recaptcha-result';
import {ClientOptions, request} from './client';

type BaseRawRecaptchaResponse = {
  challenge_ts: string;
  'error-codes'?: string[];
  'apk_package_name'?: string;
  hostname?: string;
  success: boolean;
}

type RawRecaptchaV2Response = BaseRawRecaptchaResponse;

type RawRecaptchaV3Response = BaseRawRecaptchaResponse & {
  action: string;
  score: number;
}

export type RecaptchaOptions = {
  agent?: Agent;

  /** The hostname that the client connects to. Setting this may be valueable for
   *  debugging/testing or if FreeSVG changes its API address.
   */
  hostname?: string;
  port?: number | string;
  protocol?: 'https:' | 'http:';

  /** Milliseconds before a request times out. */
  timeout?: number;
};

abstract class Recaptcha implements RecaptchaOptions {
  agent?: Agent;
  hostname?: string;
  port?: number | string;
  protocol?: 'https:' | 'http:';
  timeout?: number;
  secretKey: string;

  /**
   * 
   * @param {string} secretKey - The secret key used for communication between
   * your site and reCAPTCHA.
   */
  constructor(secretKey: string, options: RecaptchaOptions) {
    if(typeof secretKey !== 'string') {
      throw new Error('A secret key must be provided.');
    }

    this.agent = options.agent;
    this.hostname = options.hostname || 'google.com';
    this.protocol = options.protocol || 'https:';
    this.port = options.port || this.protocol === 'https:' ? 443 : 80;
    this.timeout = options.timeout;
    this.secretKey = secretKey;
  }

  _getClientOptions(responseToken: string, remoteIP?: string): ClientOptions {
    return {
      hostname: this.hostname,
      port: this.port,
      protocol: this.protocol,
      path: `/recaptcha/api/siteverify?secret=${this.secretKey}&response=${responseToken}&remoteip=${remoteIP}`,
      timeout: this.timeout
    };
  }

  _request(responseToken: string, remoteIP?: string) {
    const options = this._getClientOptions(responseToken, remoteIP);

    return request(options);
  }
}

export class RecaptchaV2 extends Recaptcha {

  /**
   * Verify the reCAPTCHA V2 response token received from the client.
   * @param {string} responseToken - The user response token provided by the
   * reCAPTCHA client-side integration on your site.
   * @param {string} [remoteIP] - Optional. The user's IP address.
   */
  verify(responseToken: string, remoteIP?: string): Promise<RecaptchaV2Result> {
    return this._request(responseToken, remoteIP)
    .then((rawResult: RawRecaptchaV2Response) => {
      return new RecaptchaV2Result(rawResult);
    });
  }
}

export class RecaptchaV3 extends Recaptcha {

  /**
   * Verify the reCAPTCHA V3 response token received from the client.
   * @param {string} responseToken - The user response token provided by the
   * reCAPTCHA client-side integration on your site.
   * @param {string} [remoteIP] - Optional. The user's IP address.
   */
  verify(responseToken: string, remoteIP?: string): Promise<RecaptchaV3Result> {
    return this._request(responseToken, remoteIP)
    .then((rawResult: RawRecaptchaV3Response) => {
      return new RecaptchaV3Result(rawResult);
    });
  }
}