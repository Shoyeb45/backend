/**
 * Class for handling response of a request
 */
class ApiResponse {

    /**
     * 
     * @param {*} statusCode Represents the HTTP status code of the error, making it easy to identify the type of error.
     * @param {*} data A placeholder property for any additional data related to the error. This can be useful for API responses where you want to include extra context.
     * @param {*} message Stores the error message, which is already set by super(message) but is explicitly assigned here for clarity.
     */
    constructor (statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;

        /**
         * Indicates the failure of the operation. Typically, a property like this is included in API error objects for consistency with successful responses.
         */
        this.success = (statusCode < 400); // because all the success code are less than 400
    }
}

export { ApiResponse };