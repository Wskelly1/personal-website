'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Reading List', path: '/reading-list' },
  ];

  const adminItems = [
    { label: 'Projects', path: '/admin/projects_auth' },
    { label: 'Blog', path: '/admin/blog_auth' },
    { label: 'Reading List', path: '/admin/reading-list_auth' },
  ];

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <nav className="bg-[#034ed2] text-white relative overflow-visible">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Home Link */}
          <Link href="/" className="flex-shrink-0 text-center ml-[-2rem]" aria-label="Home">
            <span className="font-extrabold text-3xl tracking-tight text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              William <span className="font-light text-gray-200">Skelly</span>
            </span>
          </Link>

          {/* Right side - Navigation Links */}
          <div className="flex space-x-8 items-center flex-1 justify-end">
            {session && isAdminRoute ? (
              <>
                <Link href="/admin/projects_auth" className={`${pathname === '/admin/projects_auth' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Projects</Link>
                <Link href="/admin/blog_auth" className={`${pathname === '/admin/blog_auth' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Blog</Link>
                <Link href="/admin/reading-list_auth" className={`${pathname === '/admin/reading-list_auth' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Reading List</Link>
                <Link href="/admin/account" className={`${pathname === '/admin/account' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Profile</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-primary">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/about" className={`${pathname === '/about' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>About</Link>
                <Link href="/projects" className={`${pathname === '/projects' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Projects</Link>
                <Link href="/blog" className={`${pathname === '/blog' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Blog</Link>
                <Link href="/reading-list" className={`${pathname === '/reading-list' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Reading List</Link>
                <Link href="/contact" className={`${pathname === '/contact' ? 'border-b-2 border-white' : ''} text-white transition-colors duration-200 py-2 text-sm font-medium`}>Contact Me</Link>
                {session && (
                  <Link href="/admin/projects_auth" className="text-white transition-colors duration-200 py-2 text-sm font-medium">Back to Admin</Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;