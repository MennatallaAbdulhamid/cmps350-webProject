//import { redirect } from 'next/navigation';
import Login from './login/page';

export default function Home() {
  // redirect('/statistics');
  // redirect('/login');
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <p className="text-lg">Welcome to MyCSE!</p>
      <Login />
    </>
  );
}
