import { GoogleAuth } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

let authClient: GoogleAuth | undefined;

export function getAuth(): GoogleAuth {
  if (authClient) return authClient;

  const keyFile = process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
  if (!keyFile) {
    throw new Error(
      "GSC_SERVICE_ACCOUNT_KEY_FILE is not set (path to the service account JSON key).",
    );
  }

  authClient = new GoogleAuth({ keyFile, scopes: SCOPES });
  return authClient;
}
