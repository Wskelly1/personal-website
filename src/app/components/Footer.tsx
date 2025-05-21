import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-neutral-100 border-t mt-12">
      <div className="flex justify-center space-x-6">
        <a href="https://www.linkedin.com/in/william-skelly/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
        </a>
        <a href="https://github.com/Wskelly1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
        </a>
        <a href="https://www.instagram.com/will.skellt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="text-2xl text-primary-600 hover:text-primary-700 transition-colors" />
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary px-4 py-1 text-base font-medium">
          Download Resume
        </a>
      </div>
    </footer>
  );
} 