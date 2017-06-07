/**
 * Created by marcelboes on 05.06.17.
 */

export class BaseValidator {
    static escapeHTML(input: string): string {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/"/g, "&#039;");
    }
}