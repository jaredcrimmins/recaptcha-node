type RecaptchaResultCreationAttrs = {
  challenge_ts: string;
  'error-codes'?: string[];
  'apk_package_name'?: string;
  hostname?: string;
  success: boolean;
}

export abstract class RecaptchaResult {
  apkPackageName?: string;
  challengeTimestamp?: string;
  errorCodes?: string[];
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
}

export class RecaptchaV3Result extends RecaptchaResult {
  action: string;
  score: number;

  constructor(attrs: RecaptchaV3ResultCreationAttrs) {
    super(attrs);

    this.action = attrs.action;
    this.score = attrs.score;
  }
}