# recaptcha-node
A Node.js library to verify reCAPTCHA v2/v3 response tokens received from a client.

[GitHub](https://github.com/jaredcrimmins/recaptcha-node) | [NPM](https://www.npmjs.com/package/recaptcha-node)

## Install

```shell
npm install recaptcha-node
```

## Usage

### Importing

If you are using reCAPTCHA v2, import the `RecaptchaV2` class.

```javascript
const {RecaptchaV2} = require('recaptcha-node');
```

If you are using reCAPTCHA v3, import the `RecaptchaV3` class.

```javascript
const {RecaptchaV3} = require('recaptcha-node');
```

### Verifying a Response Token

To verify a response token using either `RecaptchaV2` or `RecaptchaV3`, call the `verify` method.

The `verify` method's signature on `RecaptchaV2` and `RecaptchaV3` is nearly identical, differing only in the return value. `RecaptchaV2`'s `verify` method returns an instance of `RecaptchaV2Result`, and `RecaptchaV3`'s `verify` method returns an instance of `RecaptchaV3Result`.

```javascript
const {RecaptchaV2} = require('recaptcha-node');

const recaptchaV2 = new RecaptchaV2('secretKey');

recaptchaV2.verify('responseToken')
.then(result => {
  if (result.success) {
    // reCAPTCHA response was valid.
  }
  else {
    // reCAPTCHA response was invalid.
  }
})
.catch(error =>  {
  // Request failed.
});
```

## Configuration

The `RecaptchaV2` and `RecaptchaV3` classes can be initialized with an options object as the second argument.

```javascript
const {RecaptchaV3} = require('recaptcha-node');

const recaptchaV3 = new RecaptchaV3('secretKey', {
  hostname: 'google.com',
  port: 443,
  protocol: 'https',
  timeout: 30 * 1000,
});
```

Name | Default | Description
---- | ------- | -----------
agent | `undefined` |
hostname | `google.com` | Hostname that requests are made to
port | `80` if `protocol` is `'http'`, `443` if `protocol` is  `'https'` | Port that requests are made to
protocol | `'https'` | `'https'` or `'http'` | Protocol that requests are made with
timeout | `30000` | Milliseconds before a request times out. Setting to `0` will prevent the request from ever timing out

## Objects

### RecaptchaV2Result

Property | Type | Optional | Description
-------- | ---- | -------- | -----------
success | `boolean` | `false` | Whether this request was a valid reCAPTCHA token for your site
challengeTimestamp | `Date` | `false` | Timestamp of the challenge load
apkPackageName | `string` | `true` | The package name of the app where the reCAPTCHA was solved
hostname | `string` | `true` | The hostname of the site where the reCAPTCHA was solved
errorCodes | `string[]` | `true` |

### RecaptchaV3Result

Property | Type | Optional | Description
-------- | ---- | -------- | -----------
success | `boolean` | `false` | Whether this request was a valid reCAPTCHA token for your site
score | `number` | `false` | The score for this request (0.0 - 1.0)
action | `string` | `false` | The action name for this request
challengeTimestamp | `Date` | `false` | Timestamp of the challenge load
hostname | `string` | `false` | The hostname of the site where the reCAPTCHA was solved
errorCodes | `string[]` | `true` | 