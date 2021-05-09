import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from './entity/User'
import { MyContext } from './MyContext'
import { createAccessToken, createRefreshToken } from './auth'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find()
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

    res.cookie('jid', createRefreshToken(user), {
      httpOnly: true,
    })

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
}
