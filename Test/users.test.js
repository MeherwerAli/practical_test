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

describe('User Controller', () => {
  describe('GET /api/users', () => {
    it('should return an array of users', async () => {
      const res = await chai
        .request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await chai
        .request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userName: 'Test User1',
          email: 'testuser@gmail.com',
          password: 'Test@123456',
        });

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.userName).to.equal('Test User');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await chai
        .request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userName: 'Test User2',
          email: 'testuser@gmail.com',
          password: 'Test@123456',
        });

      const res = await chai
        .request(app)
        .put(`/api/users/${user.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          userName: 'Updated Test User'
        });

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.userName).to.equal('Updated Test User');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await chai
        .request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userName: 'Test User',
          email: 'testuser@gmail.com',
          password: 'Test@123456',
        });

      const res = await chai
        .request(app)
        .delete(`/api/users/${user.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.be.empty;
    });
  });
});
