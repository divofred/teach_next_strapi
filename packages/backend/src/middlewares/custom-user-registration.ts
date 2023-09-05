'use strict'

/**
 * `custom-user-registration` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { method, url } = ctx.request

    if (method === 'POST' && url.startsWith('/api/auth/local/register')) {
      const {
        email,
        city,
        age,
        password,
        gender,
        hair,
        height,
        weight,
        isPaid,
        salary,
        minDesiredSalary,
        fullName,
        manAttributes,
        womanAttributes,
      } = ctx?.request?.body

      if (gender === 'male') {
        ctx.request.body = {
          username: email,
          email,
          city,
          age,
          password,
          gender,
          fullName,
          hair,
          isPaid,
          isOnline: true,
          manAttributes: {
            height,
            weight,
            salary,
          },
        }
      } else if (gender === 'female') {
        ctx.request.body = {
          username: email,
          email,
          city,
          age,
          password,
          gender,
          hair,
          fullName,
          isOnline: true,
          womanAttributes: {
            height,
            weight,
            minDesiredSalary,
          },
        }
      } else {
        return ctx.badRequest('Unknown gender')
      }

      if (gender === 'male' && womanAttributes) {
        return ctx.badRequest('Men cannot post in women field.')
      }
      if (gender === 'female' && manAttributes) {
        return ctx.badRequest('Women cannot post in men field.')
      }
    }
    await next()
  }
}
