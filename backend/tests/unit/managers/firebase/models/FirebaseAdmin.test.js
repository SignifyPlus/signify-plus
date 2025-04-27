const FirebaseAdmin = require('../../../../../managers/firebase/models/FirebaseAdmin');

describe('FirebaseAdmin Unit Test', () => {
    const mockDetails = {
        type: 'service_account',
        project_id: 'my-project-id',
        private_key_id: 'private-key-id',
        private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
        client_email: 'firebase-adminsdk@example.com',
        client_id: '1234567890',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        universe_domain: 'googleapis.com',
    };

    it('should correctly assign all properties from firebaseAdminDetails', () => {
        const admin = new FirebaseAdmin(mockDetails);

        expect(admin.type).toBe(mockDetails.type);
        expect(admin.project_id).toBe(mockDetails.project_id);
        expect(admin.private_key_id).toBe(mockDetails.private_key_id);
        expect(admin.private_key).toBe(mockDetails.private_key);
        expect(admin.client_email).toBe(mockDetails.client_email);
        expect(admin.client_id).toBe(mockDetails.client_id);
        expect(admin.auth_uri).toBe(mockDetails.auth_uri);
        expect(admin.token_uri).toBe(mockDetails.token_uri);
        expect(admin.client_x509_cert_url).toBe(mockDetails.client_x509_cert_url);
        expect(admin.auth_provider_x509_cert_url).toBe(mockDetails.auth_provider_x509_cert_url);
        expect(admin.universe_domain).toBe(mockDetails.universe_domain);
    });

    it('should return a properly formatted string with toString()', () => {
        const admin = new FirebaseAdmin(mockDetails);
        const result = admin.toString();

        expect(result).toContain(`Type: ${mockDetails.type}`);
        expect(result).toContain(`Project ID: ${mockDetails.project_id}`);
        expect(result).toContain(`Private Key ID: ${mockDetails.private_key_id}`);
        expect(result).toContain(`Client Email: ${mockDetails.client_email}`);
        expect(result).toContain(`Client ID: ${mockDetails.client_id}`);
        expect(result).toContain(`Auth URI: ${mockDetails.auth_uri}`);
        expect(result).toContain(`Token URI: ${mockDetails.token_uri}`);
        expect(result).toContain(`Client X509 Cert URL: ${mockDetails.client_x509_cert_url}`);
        expect(result).toContain(`Auth Provider X509 Cert URL: ${mockDetails.auth_provider_x509_cert_url}`);
        expect(result).toContain(`Universe Domain: ${mockDetails.universe_domain}`);
    });
});
