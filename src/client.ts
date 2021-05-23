import * as errors from './errors';
import * as https from 'https';
import * as http from 'http';

const BASE_REQUEST_OPTIONS = {
  headers: {
    'content-length': 0,
  },
  method: 'POST',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseBody = any;

export type ClientOptions = https.RequestOptions & {
  timeout?: number;
};

export function request(options: ClientOptions): Promise<ResponseBody> {
  return new Promise((resolve, reject) => {
    const requestOptions = Object.assign({}, BASE_REQUEST_OPTIONS, options);
    const requestClient =
      options.protocol === 'https:' ? https.request : http.request;
    const request = requestClient(requestOptions, response => {
      const data: Uint8Array[] = [];

      response
        .on('data', (chunk: Uint8Array) => {
          data.push(chunk);
        })
        .on('end', () => {
          const rawData = parseResponseData(data);

          if (rawData instanceof Error) {
            reject(
              new errors.RecaptchaAPIError({
                original: rawData,
                message: 'The servers response was not understandable.',
              })
            );
          } else {
            resolve(rawData);
          }
        });
    });

    if (options.timeout) request.setTimeout(options.timeout);

    request.on('error', error => {
      reject(new errors.RecaptchaConnectionError(error));
    });

    request.end();
  });
}

function parseResponseData(data: Uint8Array[]): ResponseBody | Error {
  const buffer = Buffer.concat(data);

  try {
    return JSON.parse(buffer.toString());
  } catch (error) {
    return error;
  }
}
