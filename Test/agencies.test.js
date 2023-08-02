const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

let token;

before(async () => {
  const response = await chai.request(app).post('/api/v1/auth/login').send({
    email: 'm3@gmail.com',
    password: 'Mm@123456',
  });

  token = response.body.token;
});

describe('Agency Controller', () => {
  describe('GET /api/agencies', () => {
    it('should return an empty array when there are no agencies', async () => {
      const res = await chai
        .request(app)
        .get('/api/agencies')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(0);
    });
  });
});
