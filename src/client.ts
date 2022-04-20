import {SupportedProtocols} from './recaptcha';
import * as errors from './errors';
import * as https from 'https';
import * as http from 'http';

const BASE_REQUEST_OPTIONS = {
  method: 'POST',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseBody = any;

export type ClientOptions = Omit<https.RequestOptions, 'protocol'> & {
  data?: string;
  timeout?: number;
  protocol?: SupportedProtocols;
};

export function request(options: ClientOptions): Promise<ResponseBody> {
  return new Promise((resolve, reject) => {
    const requestData = options.data;
    const requestHeaders = {
      'content-length': requestData?.length,
      'content-type': requestData
        ? 'application/x-www-form-urlencoded'
        : undefined,
    };
    const requestClient =
      options.protocol === 'https' ? https.request : http.request;
    const requestOptions = Object.assign(
      {},
      BASE_REQUEST_OPTIONS,
      options,
      {headers: requestHeaders}
    );

    delete requestOptions.protocol;

    const request = requestClient(requestOptions, response => {
      const data: Uint8Array[] = [];

      response
        .on('data', (chunk: Uint8Array) => {
          data.push(chunk);
        })
        .on('end', () => {
          if (
            response.statusCode &&
            response.statusCode >= 400 &&
            response.statusCode <= 499
          ) {
            reject(new errors.RecaptchaInvalidRequestError());
          } else {
            const rawData = parseResponseData(data);

            if (rawData instanceof Error) {
              reject(
                new errors.RecaptchaAPIError({
                  original: rawData,
                  message: "The server's response was not understandable.",
                })
              );
            } else {
              resolve(rawData);
            }
          }
        });
    });

    if (options.timeout) {
      request.setTimeout(options.timeout, () => {
        reject(new errors.RecaptchaConnectionError());
      });
    }

    if (requestData) request.write(requestData);

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
