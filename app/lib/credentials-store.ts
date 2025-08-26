
// In-memory storage for credentials (replace with database in production)
let credentialsStore: any[] = [];

export function getFullCredentials() {
  return credentialsStore;
}

export function addCredential(credential: any) {
  // Remove existing credential for same provider
  credentialsStore = credentialsStore.filter(cred => cred.provider !== credential.provider);
  // Add new credential
  credentialsStore.push(credential);
}

export function getMaskedCredentials() {
  return credentialsStore?.map(cred => ({
    ...cred,
    apiKey: `****${cred?.apiKey?.slice?.(-4) ?? ''}`,
  })) ?? [];
}
