export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Optionally override the original input with the validated one
        req[property] = value;
        next();
    };
};