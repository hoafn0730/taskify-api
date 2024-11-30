const extractToken = (authorization) => {
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
};

export { extractToken };
