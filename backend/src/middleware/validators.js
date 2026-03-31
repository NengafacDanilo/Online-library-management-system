import Joi from 'joi'

export const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
  })

  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  req.validatedData = value
  next()
}

export const validateBook = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    author: Joi.string().min(2).required(),
    isbn: Joi.string().pattern(/^\d{10,13}$/).required(),
    category: Joi.string().required(),
    total_copies: Joi.number().integer().min(1).required(),
  })

  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  req.validatedData = value
  next()
}
