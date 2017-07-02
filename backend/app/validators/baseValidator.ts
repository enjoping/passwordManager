/**
 * Created by marcelboes on 05.06.17.
 */

export class BaseValidator {
    /**
     * This method escapes an input string for html injection.
     * @param input
     * @returns {string}
     */
    static escapeHTML(input: string): string {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/"/g, "&#039;");
    }
}