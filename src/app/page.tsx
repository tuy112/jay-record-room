import { cookies } from 'next/headers';
import HomePage from './Homepage';

export default async function Page() {
      
      const cookieStore = await cookies();
      const userRole = cookieStore.get('jstory_role')?.value;

      return <HomePage userRole={userRole} />;
}