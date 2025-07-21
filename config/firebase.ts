const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!firebasePrivateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is not defined');
}

const fireBaseConfig: Record<string, string | undefined> = {
    type: process.env.FIREBASE_ACCOUNT_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: firebasePrivateKey.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_X509_CERT_URL,
    universe_domain: 'googleapis.com',
};

export default fireBaseConfig;
