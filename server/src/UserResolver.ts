import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { hash } from 'bcryptjs'
import { User } from './entity/User'

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find()
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
