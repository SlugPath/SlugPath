
import { Member, MemberEmail } from './schema'
import { pool } from '../db';

export class MemberService {

  // Retreive all team members
  public async list(): Promise<Member[]> {
    const select = `SELECT (jsonb_build_object('id', id, 'name', member->>'name', 'email', member->>'email')) AS member FROM member`;
    const query = {
      text: select,
      values: [],
    };
    const { rows } = await pool.query(query);
    const members=[];
    for (const row of rows) {
      members.push(row.member);
    }
    return members;
  }

  // Retrieve one team member by email
  public async get(member: MemberEmail): Promise<Member|undefined> {
    const select = `SELECT (jsonb_build_object('id', id, 'name', member->>'name', 'email', member->>'email')) as member FROM member WHERE member->>'email' = $1`;
    const query = {
      text: select,
      values: [member.email],
    };
    const { rows } = await pool.query(query);
    return rows.length == 1 ? rows[0].member : undefined;
  }
}
