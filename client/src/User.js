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
        return Object.assign(new User(), json);
    }
}

export default User;