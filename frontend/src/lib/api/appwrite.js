import { Client, Account, Databases, Query, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a1575ed000cb7f5736d');

export const account = new Account(client);
export const databases = new Databases(client);
export { Query, ID };
export default client;
