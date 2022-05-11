import { getDatabase, ref as firebaseRef, child, Database, DatabaseReference } from 'firebase/database'
import { getAuth } from 'firebase/auth';
import { useAuth } from '@vueuse/firebase/useAuth'
import { ComputedRef } from 'nuxt/dist/app/compat/capi';

export const useUserRef = (): ComputedRef<DatabaseReference | null> => {
  const db = getDatabase();
  const auth = getAuth();

  const { user } = useAuth(auth);

  return computed(() => user.value != null ? getUserRef(db, user.value.uid) : null)
}

export const getUserRef = (db: Database, userId: string): DatabaseReference => {
  return child(child(firebaseRef(db), 'users'), userId)
}