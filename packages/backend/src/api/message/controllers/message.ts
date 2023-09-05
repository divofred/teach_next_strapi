/**
 * message controller
 */
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
  async find(ctx) {
    let sanitizedQueryParams = await this.sanitizeQuery(ctx)
    sanitizedQueryParams = {
      ...sanitizedQueryParams,
      filters: {
        $and: [
          {
            ...sanitizedQueryParams?.filters,
          },
          {
            $or: [
              {
                user1: ctx?.state?.user?.id?.toString(),
              },
              {
                user2: ctx?.state?.user?.id?.toString(),
              },
            ],
          },
        ],
      },
    }
    //@ts-ignore
    const { results, pagination } = await strapi
      .service('api::message.message')
      .find(sanitizedQueryParams)
    const sanitizedResults = await this.sanitizeOutput(results, ctx)
    return this.transformResponse(sanitizedResults, { pagination })
  },
  async update(ctx) {
    try {
      let customData = {}
      let errr = ''
      const currentUser = ctx?.state?.user?.id
      const { data } = ctx.request.body
      const { user1, user2, messages } = data

      if (user1 && user2 && messages) {
        if (user1 == currentUser || user2 == currentUser) {
          const data: any = await super.find(ctx)
          for (let i = 0; i < data?.data?.length; i++) {
            const element = data?.data[i]
            const { user1: user1new, user2: user2new } = element?.attributes
            if (user1new == currentUser || user2new == currentUser) {
              if (!messages?.length) {
                const { data: newData, meta: newMeta } = await super.update(ctx)
                customData = { data: newData, meta: newMeta }
              } else {
                for (let i = 0; i < messages?.length; i++) {
                  console.log(messages?.length)
                  const element = messages[i]
                  const { sentBy, message } = element
                  if (!sentBy || !message) {
                    errr = 'errr'
                  }
                  if (i == messages?.length - 1 && sentBy && message) {
                    const { data: newData, meta: newMeta } = await super.update(ctx)
                    customData = { data: newData, meta: newMeta }
                  }
                }
              }
            }
          }
          if (errr == '') return customData
        }
      }
      if (errr != '') return ctx.badRequest()
    } catch (error) {
      console.log('error', error.message)
      return ctx.badRequest()
    }
  },
}))

// async update(ctx) {
//   const { id } = ctx.params
//   const { user } = ctx.state
//   const { user1, user2 } = ctx.request.body

//   console.log('id', id)
//   console.log('user', user)
//   console.log('user1', id)
//   console.log('user2', user2)
//   // Check if the user is in either user1 or user2 field
//   if (user1 === user.id.toString() || user2 === user.id.toString()) {
//     // User is authorized to update the message

//     // Proceed with the update operation
//     const updatedMessage = await strapi
//       .service('api::message.message')
//       //@ts-ignore
//       .update({ id }, ctx.request.body)

//     return this.transformResponse(updatedMessage)
//   } else {
//     // User is not authorized to update the message
//     return ctx.unauthorized('You are not authorized to update this message')
//   }
// },
// export default factories.createCoreController('api::message.message')
