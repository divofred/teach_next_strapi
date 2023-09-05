export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {
    var axios = require('axios')
    var io = require('socket.io')(strapi.server.httpServer, {
      cors: {
        // cors setup
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
      },
    })
    io.on('connection', function (socket: any) {
      //Listening for a connection from the frontend
      socket.on('getUsers', async (dataReceived: any) => {
        try {
          const { data } = await axios.get('http://localhost:1337/api/messages', {
            headers: { Authorization: `Bearer ${dataReceived.jwt}` },
          })
          if (data?.data?.length == 0) {
            socket.emit('allUsers', { users: [] }, (error: any) => {
              if (error) {
                console.log(error)
              }
            })
          }
          let send = []
          for (let i = 0; i < data?.data?.length; i++) {
            const element = data?.data[i]
            const { user1, user2 } = element.attributes

            const checker =
              user1 == dataReceived.currentUserId || user2 == dataReceived.currentUserId
            if (checker) {
              if (element.attributes.messages.length != 0) {
                const checker1 = user1 == dataReceived.currentUserId ? user2 : user1
                send.push(checker1)
              }
            }
            if (i == data?.data?.length - 1) {
              let originalData = []
              for (let i1 = 0; i1 < send.length; i1++) {
                const element1 = send[i1]
                const { data } = await axios.get('http://localhost:1337/api/users/' + element1)
                originalData.push({ name: data.fullName, id: data.id })
                if (i1 == send.length - 1) {
                  socket.emit('allUsers', { originalData }, (error: any) => {
                    if (error) {
                      console.log(error)
                    }
                  })
                }
              }
            }
          }
        } catch (error) {
          console.log(error.message)
        }
      })
      const BreakError = 'breakError'
      socket.on('join', async (dataReceived: any) => {
        try {
          const { data } = await axios.get('http://localhost:1337/api/messages', {
            headers: { Authorization: `Bearer ${dataReceived.jwt}` },
          })
          if (data?.data?.length == 0) {
            const url = 'http://localhost:1337/api/messages'
            const data = {
              data: {
                user1: dataReceived.partnerId.toString(),
                user2: dataReceived.currentUserId.toString(),
                messages: [],
              },
            }

            const headers = {
              Authorization: 'Bearer ' + dataReceived.jwt,
              'Content-Type': 'application/json',
            }

            await axios.post(url, data, { headers }).then((element: any) => {
              socket.emit(
                'allMessages',
                { element: [], messageId: element.data.data.id },
                (error: any) => {
                  if (error) {
                    console.log(error)
                  }
                }
              )
            })
          }
          for (let i = 0; i < data?.data?.length; i++) {
            const element = data?.data[i]
            const { user1, user2 } = element.attributes
            if (
              (user1 == dataReceived.partnerId && user2 == dataReceived.currentUserId) ||
              (user2 == dataReceived.partnerId && user1 == dataReceived.currentUserId)
            ) {
              socket.join(element.id)
              socket.emit(
                'allMessages',
                { element: element.attributes.messages, messageId: element.id },
                (error: any) => {
                  if (error) {
                    console.log(error)
                  }
                }
              )
              throw BreakError
            }
            if (i == data?.data?.length - 1) {
              console.log(dataReceived)
              const url = 'http://localhost:1337/api/messages'
              const data = {
                data: {
                  user1: dataReceived.partnerId.toString(),
                  user2: dataReceived.currentUserId.toString(),
                  messages: [],
                },
              }

              const headers = {
                Authorization: 'Bearer ' + dataReceived.jwt,
                'Content-Type': 'application/json',
              }

              await axios.post(url, data, { headers }).then((element: any) => {
                socket.join(element.data.data.id)
                socket.emit(
                  'allMessages',
                  { element: [], messageId: element.data.data.id },
                  (error: any) => {
                    if (error) {
                      console.log(error)
                    }
                  }
                )
              })
            }
          }
        } catch (error) {
          if (error == 'breakError') {
            return
          }
          console.log(error)
        }
      })
      socket.on('sendMessage', async (dataReceived: any) => {
        try {
          const { data } = await axios.get('http://localhost:1337/api/messages', {
            headers: { Authorization: `Bearer ${dataReceived.jwt}` },
          })
          const { message, currentUserId } = dataReceived
          for (let i = 0; i < data?.data?.length; i++) {
            const element = data?.data[i]
            const { user1, user2 } = element.attributes

            if (
              (user1 == dataReceived.partnerId && user2 == dataReceived.currentUserId) ||
              (user2 == dataReceived.partnerId && user1 == dataReceived.currentUserId)
            ) {
              console.log('something ooo')
              const newMessage = [
                ...element.attributes.messages,
                { sentBy: currentUserId, message },
              ]
              await axios.put(
                `http://localhost:1337/api/messages/${dataReceived.messageId}`,
                {
                  data: {
                    user1,
                    user2,
                    messages: newMessage,
                  },
                },
                {
                  headers: {
                    Authorization: 'Bearer ' + dataReceived.jwt,
                    'Content-Type': 'application/json',
                  },
                }
              )
              socket.broadcast.to(element.id).emit('message', {
                element: element.attributes.messages,
                mes: message,
                sentBy: currentUserId,
              })
              throw BreakError
            }
            if (i == data?.data?.length - 1) {
              console.log('something here')
            }
          }
        } catch (error) {
          if (error == 'breakError') {
            return
          }
        }
      })
    })
  },
}
