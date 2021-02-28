# recaptcha-node
> A library to verify the reCAPTCHA V2/V3 response token received from the client.

[GitHub](https://github.com/jaredcrimmins/recaptcha-node) | [NPM](https://www.npmjs.com/package/recaptcha-node)

## Install

```shell
npm install recaptcha-node
```

## Usage

```javascript
const {Recaptcha} = require('recaptcha-node');
const recaptcha = new Recaptcha('secretKey');

recaptcha.verify('responseToken')
.then(result => {
  if(result.success) {
    // reCAPTCHA response was valid.
  }
  else {
    // reCAPTCHA response was invalid.
  }
})
.catch((error) =>  {
  // Request failed.
});
```