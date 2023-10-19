
import http from 'http'
import supertest from 'supertest';
import 'whatwg-fetch'

// import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

jest.setTimeout(10000);

beforeAll( async () => {
  server = http.createServer(requestHandler);
  server.listen();
  request = supertest(server);
  // await db.reset();
  return new Promise(resolve => setTimeout(resolve, 500));
});

afterAll((done) => {
  server.close(done);
  // db.shutdown();
});

test('Course List', async () => {
  await request.post('/api/graphql')
    .send({query:
      `query AllCourses {
        courses {
          id
          name
          department
          number
          credits
        }
      }`
    })
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.courses.length).toEqual(197);
      expect(data.body.data.courses[0].id).toBeDefined();
      expect(data.body.data.courses[0].id).toEqual('8522ab12-9bf1-408c-ba2d-560ee8a34009');
      expect(data.body.data.courses[0].name).toBeDefined();
      expect(data.body.data.courses[0].name).toEqual('Personal Computer Concepts: Software and Hardware');
      expect(data.body.data.courses[0].department).toBeDefined();
      expect(data.body.data.courses[0].department).toEqual('CSE');
      expect(data.body.data.courses[0].number).toBeDefined();
      expect(data.body.data.courses[0].number).toEqual('3');
      expect(data.body.data.courses[0].credits).toBeDefined();
      expect(data.body.data.courses[0].credits).toEqual(5);
    });
  });
