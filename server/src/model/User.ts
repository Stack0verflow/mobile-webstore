export class User {
    uuid: string;
    email: string;
    password: string;
    adminToken: string | null;

    constructor(
        uuid: string,
        email: string,
        password: string,
        adminToken: string | null
    ) {
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.adminToken = adminToken;
    }
}
