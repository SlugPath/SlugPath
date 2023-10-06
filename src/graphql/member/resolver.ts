
import { Member, MemberEmail } from './schema';
import { MemberService } from './service';
import { Args, Query, Resolver } from 'type-graphql';

@Resolver()
export class MemberResolver {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => [Member])
  async member() : Promise<Member[]> {
    return await new MemberService().list();
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => Member)
  async getMember(
    @Args() input: MemberEmail,
  ) : Promise<Member|undefined> {
    return await new MemberService().get(input);
  }
}
