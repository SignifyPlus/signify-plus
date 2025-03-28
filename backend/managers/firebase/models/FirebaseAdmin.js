
class FirebaseAdmin {
    constructor(firebaseAdminDetails) {
        this.type = firebaseAdminDetails.type;
        this.project_id = firebaseAdminDetails.project_id;
        this.private_key_id = firebaseAdminDetails.private_key_id;
        this.private_key = firebaseAdminDetails.private_key;
        this.client_email = firebaseAdminDetails.client_email;
        this.client_email = firebaseAdminDetails.client_email;
        this.client_id = firebaseAdminDetails.client_id;
        this.auth_uri = firebaseAdminDetails.auth_uri;
        this.token_uri = firebaseAdminDetails.token_uri;
        this.client_x509_cert_url = firebaseAdminDetails.client_x509_cert_url;
        this.auth_provider_x509_cert_url = firebaseAdminDetails.auth_provider_x509_cert_url;
        this.universe_domain = firebaseAdminDetails.universe_domain;
    }

    toString() {
        return `Firebase Admin Details:
          Type: ${this.type}
          Project ID: ${this.project_id}
          Private Key ID: ${this.private_key_id}
          Client Email: ${this.client_email}
          Client ID: ${this.client_id}
          Auth URI: ${this.auth_uri}
          Token URI: ${this.token_uri}
          Client X509 Cert URL: ${this.client_x509_cert_url}
          Auth Provider X509 Cert URL: ${this.auth_provider_x509_cert_url}
          Universe Domain: ${this.universe_domain}`;
      }
}

module.exports = FirebaseAdmin;
