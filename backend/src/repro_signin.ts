
import axios from 'axios';
import { randomBytes } from 'crypto';

const API_URL = 'http://localhost:3000/api/v1';

async function run() {
  const username = `testuser_${randomBytes(4).toString('hex')}`;
  const password = 'password123';

  console.log(`Attempting to signup with username: ${username}`);

  try {
    // 1. Signup
    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      console.log('✅ Signup successful');
    } catch (e: any) {
      console.error('❌ Signup failed:', e.response?.data || e.message);
      return;
    }

    // 2. Signin
    console.log(`Attempting to signin with username: ${username}`);
    try {
      const res = await axios.post(`${API_URL}/signin`, { username, password });
      console.log('✅ Signin successful:', res.data);
    } catch (e: any) {
      console.error('❌ Signin failed:', e.response?.data || e.message);
      if (e.response?.status === 500) {
        console.log('Reproduced 500 Internal Server Error!');
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

run();
