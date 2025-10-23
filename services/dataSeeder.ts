// services/dataSeeder.ts
import { localBackend } from './localBackend';

/**
 * Checks if initial data (default users) exists, and if not, seeds it.
 * This prevents data from being overwritten on every app load.
 */
export const seedInitialData = () => {
  const users = localBackend.getAllUsers();
  if (users.length === 0) {
    console.log("No users found. Seeding initial data...");
    localBackend.resetData(); // This will seed the default users
    console.log("Data seeding complete.");
  } else {
    console.log("Existing data found. Skipping seed.");
  }
};
