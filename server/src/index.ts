import 'dotenv/config'
import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import { verify } from 'jsonwebtoken'
//
import { buildSchema } from 'type-graphql'
import { UserResolver } from './UserResolver'
//
import { User } from './entity/User'
import { createAccessToken, createRefreshToken } from './auth'
import { sendRefreshToken } from './sendRefreshToken'
;(async () => {
  const app = express()

  app.get('/', (_, res) => {
    res.send('working')
  })

  app.post('/refresh_token', cookieParser(), async (req, res) => {
    console.log(1)
    const token = req.cookies.jid
    if (!token) {
      console.log(2)
      return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
      console.log(payload)
    } catch (err) {
      console.log(err)
      return res.send({ ok: false, accessToken: '' })
    }
    const user = await User.findOne({ id: payload.userId })
    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, accessToken: createAccessToken(user) })
  })

  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => console.log('server started on localhost:4000'))
})()
