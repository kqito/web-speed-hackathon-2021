import { gzip } from 'pako';

export const domainReg = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

export const CDN_URL = 'cache-1932b.kxcdn.com';

export const replaceCdnDomain = (url, { imageSuffix }) => {
  return `https://${CDN_URL}${url}${imageSuffix || ''}`;
};

/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  const result = await fetch(
    replaceCdnDomain(url, {
      imageSuffix: '?&width=800',
    }),
    {
      method: 'GET',
    },
  );

  const data = await result.arrayBuffer();
  return data;
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  const result = await fetch(url, {
    method: 'GET',
  });

  const json = await result.json();
  return json;
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const result = await fetch(url, {
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    method: 'POST',
  });

  const json = await result.json();
  return json;
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const compressed = gzip(uint8Array);

  const result = await fetch(url, {
    headers: {
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: compressed,
    method: 'POST',
  });

  const json = await result.json();
  return json;
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
