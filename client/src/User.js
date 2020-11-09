class User {
    constructor(
        id,
        is_active,
        is_superuser,
        email,
        container_ids,
        expire_unix,
    ) {
        this.id = id;
        this.isActive = is_active;
        this.isSuperuser = is_superuser;
        this.email = email;
        this.containerIds = container_ids;
        this.expireUnix = expire_unix;
    }

    static from(json) {
        // convert snake_case to camelCase
        json.isActive = json.is_active;
        json.isSuperuser = json.is_superuser;
        json.containerIds = json.container_ids;
        json.expireUnix = json.expire_unix;
        delete json.is_active;
        delete json.is_superuser;
        delete json.container_ids;
        delete json.expire_unix;
        return Object.assign(new User(), json);
    }
}

export default User;