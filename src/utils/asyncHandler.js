/**
 * Wrapper function to execute another function
 * @param {*} requestHandler: Function to execute asynchrounously
 * @returns function after executing 
 */
const asyncHandler = (requestHandler) => {
    // Another function
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}




export { asyncHandler };