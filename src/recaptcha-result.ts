type RecaptchaResultCreationAttrs = {
  challenge_ts: string;
  'error-codes'?: string[];
  apk_package_name?: string;
  hostname?: string;
  success: boolean;
};

export abstract class RecaptchaResult {
  /** The package name of the app where the reCAPTCHA was solved */
  apkPackageName?: string;

  /** Timestamp of the challenge load */
  challengeTimestamp?: string;

  errorCodes?: string[];

  /** The hostname of the site where the reCAPTCHA was solved */
  hostname?: string;

  success: boolean;

  constructor(attrs: RecaptchaResultCreationAttrs) {
    this.success = attrs.success;
    this.challengeTimestamp = attrs.challenge_ts;
    this.hostname = attrs.hostname;
    this.errorCodes = attrs['error-codes'];
  }
}

type RecaptchaV2ResultCreationAttrs = RecaptchaResultCreationAttrs;

export class RecaptchaV2Result extends RecaptchaResult {
  constructor(attrs: RecaptchaV2ResultCreationAttrs) {
    super(attrs);
  }
}

type RecaptchaV3ResultCreationAttrs = RecaptchaResultCreationAttrs & {
  action: string;
  score: number;
};

export class RecaptchaV3Result extends RecaptchaResult {
  /** The score for this request (0.0 - 1.0) */
  action: string;

  /** The action name for this request */
  score: number;

  constructor(attrs: RecaptchaV3ResultCreationAttrs) {
    super(attrs);

    this.action = attrs.action;
    this.score = attrs.score;
  }
}
