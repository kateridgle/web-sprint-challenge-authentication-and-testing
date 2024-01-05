module.exports = {
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
    JWT_SECRETS: process.env.JWT_SECRETS || 'encrypted'
}