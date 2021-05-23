type RecaptchaResultCreationAttrs = {
  challenge_ts: string;
  'error-codes'?: string[];
  apk_package_name?: string;
  hostname?: string;
  success: boolean;
};

export abstract class RecaptchaResult {
  /** Timestamp of the challenge load */
  challengeTimestamp?: string;

  errorCodes?: string[];

  success: boolean;

  constructor(attrs: RecaptchaResultCreationAttrs) {
    this.success = attrs.success;
    this.challengeTimestamp = attrs.challenge_ts;
    this.errorCodes = attrs['error-codes'];
  }
}

type RecaptchaV2ResultCreationAttrs = RecaptchaResultCreationAttrs;

export class RecaptchaV2Result extends RecaptchaResult {
  /** The package name of the app where the reCAPTCHA was solved */
  apkPackageName?: string;

  /** The hostname of the site where the reCAPTCHA was solved */
  hostname?: string;

  constructor(attrs: RecaptchaV2ResultCreationAttrs) {
    super(attrs);

    this.apkPackageName = attrs.apk_package_name;
  }
}

type RecaptchaV3ResultCreationAttrs = RecaptchaResultCreationAttrs & {
  action: string;
  hostname: string;
  score: number;
};

export class RecaptchaV3Result extends RecaptchaResult {
  /** The action name for this request */
  action: string;

  /** The hostname of the site where the reCAPTCHA was solved */
  hostname: string;

  /** The score for this request (0.0 - 1.0) */
  score: number;

  constructor(attrs: RecaptchaV3ResultCreationAttrs) {
    super(attrs);

    this.action = attrs.action;
    this.hostname = attrs.hostname;
    this.score = attrs.score;
  }
}
