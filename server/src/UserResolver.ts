import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from './entity/User'
import { MyContext } from './MyContext'
import { createAccessToken, createRefreshToken } from './auth'
import { isAuth } from './isAuth'
import { sendRefreshToken } from './sendRefreshToken'
import { getConnection } from 'typeorm'
import { verify } from 'jsonwebtoken'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return 'your userId is ' + payload?.userId
  }

  @Query(() => String)
  hello() {
    return 'Hello!!'
  }

  @Query(() => [User])
  users() {
    return User.find()
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext) {
    const authorization = ctx.req.headers['authorization']
    if (!authorization) {
      return null
    }
    try {
      const token = authorization.split(' ')[1]
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!)
      return User.findOne({ where: { id: payload.userId } })
    } catch (err) {
      console.log(err)
      return null
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('passowrd') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error('could not find user')
    }

    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('bad passoword')
    }

    sendRefreshToken(res, createRefreshToken(user))

    // login successful
    return {
      accessToken: createAccessToken(user),
    }
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('passowrd') password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12)
      await User.insert({ email, password: hashedPassword })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1)
    return true
  }
}
