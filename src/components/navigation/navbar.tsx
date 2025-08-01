import Link from 'next/link';

export function Navbar() {
  return (
    <nav>
      <div>
        <Link href='/'>Voxa</Link>
        {/* <ul>
          <li>
            <Link href='/chat'>Chat</Link>
          </li>
          <li>
            <Link href='/group'>Groups</Link>
          </li>
        </ul> */}
      </div>
    </nav>
  );
}
