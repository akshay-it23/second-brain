import crypto from "crypto";

/**
 * Generate a cryptographically secure random string
 * @param len - Length of the random string
 * @returns Random alphanumeric string
 */
export function random(len: number): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsetLength = charset.length;

    let result = "";
    const randomBytes = crypto.randomBytes(len);

    for (let i = 0; i < len; i++) {
        result += charset[randomBytes[i] % charsetLength];
    }

    return result;
}