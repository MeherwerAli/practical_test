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

describe('Restaurant Controller', () => {
  describe('GET /api/restaurants', () => {
    it('should return an empty array when there are no restaurants', async () => {
      const res = await chai
        .request(app)
        .get('/api/restaurants')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(0);
    });
  });

  describe('POST /api/restaurants', () => {
    it('should create a new restaurant', async () => {
      const res = await chai
        .request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Restaurant',
          address: '123 Test St',
          cuisine: 'Test Cuisine',
          coordinates: {
            latitude: 40.7128,
            longitude: 74.0060
          }
        });

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.name).to.equal('Test Restaurant');
    });
  });

  describe('PUT /api/restaurants/:id', () => {
    it('should update a restaurant', async () => {
      const restaurant = await chai
        .request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Restaurant',
          address: '123 Test St',
          cuisine: 'Test Cuisine',
          coordinates: {
            latitude: 40.7128,
            longitude: 74.0060
          }
        });

      const res = await chai
        .request(app)
        .put(`/api/restaurants/${restaurant.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Test Restaurant'
        });

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.name).to.equal('Updated Test Restaurant');
    });
  });

  describe('DELETE /api/restaurants/:id', () => {
    it('should delete a restaurant', async () => {
      const restaurant = await chai
        .request(app)
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Restaurant',
          address: '123 Test St',
          cuisine: 'Test Cuisine',
          coordinates: {
            latitude: 40.7128,
            longitude: 74.0060
          }
        });

      const res = await chai
        .request(app)
        .delete(`/api/restaurants/${restaurant.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.be.empty;
    });
  });
});
