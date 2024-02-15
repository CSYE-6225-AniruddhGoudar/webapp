import request from 'supertest';
import app from './src/apiServer.js';
import { sequelize } from '../src/util/database.js';


describe('User API Endpoints', () => {
  let userId;
  let email;
  let password;
  let userData;

  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
      userData = {
        first_name: 'Anirudh',
        last_name: 'Goudar',
        email: `ani${Date.now()}@example.com`,
        password: 'password1234',
      };

      const response = await request(app)
        .post('/v1/user')
        .send(userData)
        .expect(201);

      userId = response.body.id;
      email = userData.email;
      password = userData.password;
    } catch (error) {
      // Fail the test if database synchronization or user creation fails
      throw new Error(`Failed to set up test data: ${error.message}`);
    }
  });

  it('should create a new user and retrieve their data', async () => {
    try {
      const response = await request(app)
        .get('/v1/user/self')
        .auth(email, password)
        .expect(200);

      expect(response.body.id).toEqual(userId);
      expect(response.body.first_name).toEqual(userData.first_name);
      expect(response.body.last_name).toEqual(userData.last_name);
    } catch (error) {
      // Fail the test with a specific message if retrieval fails
      throw new Error(`Failed to retrieve user data: ${error.message}`);
    }
  });

  it('should update user data and verify the changes', async () => {
    try {
      if (!userId) {
        throw new Error('User ID not found. Test 1 may have failed.');
      }

      const updatedUserData = {
        first_name: 'Ram',
        last_name: 'Verma',
       // password: 'RV@123', // Update password
      };

      await request(app)
        .put('/v1/user/self')
        .send(updatedUserData)
        .auth(email, password)
        .expect(204); // No content on successful update

      //password = updatedUserData.password; // Update password for subsequent requests

      // Fetch updated user data using updated credentials
      const response = await request(app)
        .get('/v1/user/self')
        .auth(email, password)
        .expect(200);

      // Assertions to validate updated user data
      expect(response.body.id).toEqual(userId);
      expect(response.body.first_name).toEqual(updatedUserData.first_name);
      expect(response.body.last_name).toEqual(updatedUserData.last_name);
    } catch (error) {
      // Fail the test with a specific message if update or verification fails
      throw new Error(`Failed to update user data: ${error.message}`);
    }
  });

  afterAll(async () => {
    try {
      // Close the Sequelize connection after tests are completed
      await sequelize.close();
    } catch (error) {
      // Log an error if closing the connection fails, but don't fail the test
      console.error('Error closing Sequelize connection:', error);
    }
  });
});
