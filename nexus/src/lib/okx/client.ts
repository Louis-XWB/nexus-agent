import crypto from "crypto";

const OKX_BASE_URL = "https://web3.okx.com";

interface OKXClientConfig {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  projectId: string;
}

function getConfig(): OKXClientConfig {
  const apiKey = process.env.OKX_API_KEY;
  const secretKey = process.env.OKX_SECRET_KEY;
  const passphrase = process.env.OKX_PASSPHRASE;
  const projectId = process.env.OKX_PROJECT_ID;

  if (!apiKey || !secretKey || !passphrase || !projectId) {
    throw new Error("Missing OKX API credentials in environment variables");
  }

  return { apiKey, secretKey, passphrase, projectId };
}

function sign(
  timestamp: string,
  method: string,
  requestPath: string,
  body: string,
  secretKey: string
): string {
  const prehash = timestamp + method.toUpperCase() + requestPath + body;
  return crypto
    .createHmac("sha256", secretKey)
    .update(prehash)
    .digest("base64");
}

function buildHeaders(
  method: string,
  requestPath: string,
  body: string = ""
): Record<string, string> {
  const config = getConfig();
  const timestamp = new Date().toISOString();
  const signature = sign(timestamp, method, requestPath, body, config.secretKey);

  return {
    "OK-ACCESS-KEY": config.apiKey,
    "OK-ACCESS-SIGN": signature,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": config.passphrase,
    "OK-ACCESS-PROJECT": config.projectId,
    "Content-Type": "application/json",
  };
}

export async function okxGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  const requestPath = path + queryString;
  const headers = buildHeaders("GET", requestPath);

  const response = await fetch(OKX_BASE_URL + requestPath, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OKX API error ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (json.code !== "0") {
    throw new Error(`OKX API error code ${json.code}: ${json.msg}`);
  }

  return json.data as T;
}

export async function okxPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  const bodyStr = JSON.stringify(body);
  const headers = buildHeaders("POST", path, bodyStr);

  const response = await fetch(OKX_BASE_URL + path, {
    method: "POST",
    headers,
    body: bodyStr,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OKX API error ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (json.code !== "0") {
    throw new Error(`OKX API error code ${json.code}: ${json.msg}`);
  }

  return json.data as T;
}
