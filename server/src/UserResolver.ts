import { Arg, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { User } from './entity/User'

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
    @Arg('passowrd') password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error('could not find user')
    }

    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('bad passoword')
    }

    // login successful
    return {
      accessToken: sign({ userId: user.id }, 'asleghpqwouernga', {
        expiresIn: '15m',
      }),
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
