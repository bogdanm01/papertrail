import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.js';

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  profilePicture: varchar('profile_picture'),
  name: varchar('name'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  onboardingStep: integer('onboarding_step').default(1).notNull(),
  ...timestamps,
});
