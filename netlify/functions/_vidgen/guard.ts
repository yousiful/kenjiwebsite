import { readyDb, getUser, type Db, type Row } from './db';
import { fail, notConnected, readSession, sessionSecret } from './common';

/** Loads the signed-in person, or returns the Response to send (503 when not set up, 401 when signed out). */
export async function withUser(req: Request): Promise<{ db: Db; user: Row } | Response> {
  if (!sessionSecret()) return notConnected('sign-in');
  let db: Db | null;
  try {
    db = await readyDb();
  } catch (e) {
    console.error('vidgen db', e);
    return fail(503, 'We could not reach the studio database. Please try again in a minute.');
  }
  if (!db) return notConnected('database');
  const s = readSession(req);
  if (!s) return fail(401, 'Please sign in again.', { signedOut: true });
  const user = await getUser(db, s.uid);
  if (!user) return fail(401, 'Please sign in again.', { signedOut: true });
  return { db, user };
}
