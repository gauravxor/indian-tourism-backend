import bcrypt from "bcryptjs";

/** Function to validate user password */
async function validatePass(plaintextPassword: string, hash: string) {
    const hashCheckResult = await bcrypt.compare(plaintextPassword, hash);
    return hashCheckResult;
}


export {
    validatePass,
};
