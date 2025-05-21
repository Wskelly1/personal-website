import Image from 'next/image';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';

export default function ProfileCard() {
  return (
    <div className="flex flex-col items-center w-[32rem] z-50">
      {/* Silo Background and Large Image */}
      <div className="relative w-full flex flex-col items-center" style={{ height: '440px' }}>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[320px] h-[380px] bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-t-full rounded-b-2xl z-0 shadow-md" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[480px] h-[480px] flex items-end justify-center z-10">
          <Image
            src="/profile-transparent.png"
            alt="William Skelly"
            width={480}
            height={480}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
      {/* Tightly Centered Info Section between image and button */}
      <div className="flex flex-col items-center w-full" style={{ minHeight: '80px', justifyContent: 'center', marginTop: '12px', marginBottom: '12px' }}>
        <div className="flex flex-col items-start text-left space-y-1 w-[300px] flex-1 justify-center my-auto">
          <div className="flex items-center gap-2 text-[#2E2F35] text-lg">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="flex-1 text-center">Duke University Student Athlete</span>
          </div>
          <div className="flex items-center gap-2 text-[#2E2F35] text-lg">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <span className="flex-1 text-center">Undergraduate Researcher</span>
          </div>
          <div className="flex items-center gap-2 text-[#2E2F35] text-lg">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Link href="/contact" className="flex-1 text-center text-[#2E2F35] hover:text-primary-600 transition-colors underline">
              william.skelly@duke.edu
            </Link>
          </div>
        </div>
      </div>
      {/* Resume Button */}
      <div className="flex justify-center w-full mt-2">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 text-lg font-semibold py-3 rounded-xl w-[300px] bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors"
        >
          <FaDownload className="w-6 h-6" /> Resume
        </a>
      </div>
    </div>
  );
} 