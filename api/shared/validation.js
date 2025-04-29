/**
 * Simple validation helper functions for Vercel serverless functions
 */

/**
 * Validate that request has the correct HTTP method
 * @param req Request object
 * @param res Response object
 * @param method HTTP method to validate against
 * @returns true if validation passes, false if it fails (and response is already sent)
 */
export function validateMethod(req, res, method) {
  if (req.method !== method) {
    res.status(405).json({
      success: false,
      error: `Method not allowed. Only ${method} requests are accepted.`
    });
    return false;
  }
  return true;
}

/**
 * Validate that request body matches the provided schema
 * @param req Request object 
 * @param res Response object
 * @param schema Schema object with property names and validation functions
 * @returns Object with validation result and data or errors
 */
export function validateBody(req, res, schema) {
  const errors = {};
  const data = {};
  
  // Check if body exists
  if (!req.body) {
    res.status(400).json({
      success: false,
      error: 'Missing request body'
    });
    return { valid: false, errors: { _body: 'Missing request body' } };
  }
  
  // Validate each field in the schema
  Object.entries(schema).forEach(([field, validator]) => {
    if (validator.required && (req.body[field] === undefined || req.body[field] === null)) {
      errors[field] = `Field '${field}' is required`;
    } else if (req.body[field] !== undefined && validator.validate) {
      const validationResult = validator.validate(req.body[field]);
      if (validationResult !== true) {
        errors[field] = validationResult;
      } else {
        data[field] = req.body[field];
      }
    } else if (req.body[field] !== undefined) {
      // No validator but field exists
      data[field] = req.body[field];
    }
  });
  
  // Check if validation failed
  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      error: 'Invalid request data',
      details: errors
    });
    return { valid: false, errors };
  }
  
  return { valid: true, data };
}

export default {
  validateMethod,
  validateBody
};