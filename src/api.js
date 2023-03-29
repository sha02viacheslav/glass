import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000, // set timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
    'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
  },
  data: {
    "jsonrpc": "2.0"
  }
});

export default instance;