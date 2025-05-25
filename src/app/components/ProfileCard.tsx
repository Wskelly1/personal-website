import Image from 'next/image';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';

export default function ProfileCard({ compact = false, mobileProfile = false }: { compact?: boolean, mobileProfile?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${mobileProfile ? 'h-full w-full max-w-[140px] justify-between' : compact ? 'w-[120px]' : 'w-[32rem]'} z-10`}>
      {/* Silo Background and Large Image */}
      <div className={`relative w-full flex flex-col items-center ${mobileProfile ? 'flex-shrink-0 h-full -mt-12' : ''}`} style={{ height: mobileProfile ? '340px' : compact ? '160px' : '440px' }}>
        {/* Background: fixed size and position */}
        <div className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-[140px] h-[220px] md:w-[120px] md:h-[120px] bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-t-full rounded-b-2xl z-0 shadow-md`} />
        {/* Image: much larger, bottom aligned, pops out above background */}
        <div className={`absolute left-1/2 -translate-x-1/2 bottom-0 flex items-end justify-center z-10 w-[300px] h-[300px] md:w-[120px] md:h-[120px]`}>
          <Image
            src="/profile-transparent.png"
            alt="William Skelly"
            width={mobileProfile ? 300 : compact ? 120 : 480}
            height={mobileProfile ? 300 : compact ? 120 : 480}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
      {/* Tightly Centered Info Section between image and button */}
      <div className={`flex flex-col items-center w-full flex-1 ${mobileProfile ? 'justify-between h-full py-2' : ''}`} style={{ minHeight: mobileProfile ? '60px' : compact ? '30px' : '80px', justifyContent: 'center', marginTop: mobileProfile ? '8px' : compact ? '12px' : '24px', marginBottom: mobileProfile ? '0' : compact ? '4px' : '12px' }}>
        <div className={`flex flex-col items-center text-center space-y-2 ${mobileProfile ? 'w-[120px]' : compact ? 'w-[90px]' : 'w-[300px]'} flex-1 justify-center my-auto`}>
          <div className={`${mobileProfile ? 'text-base' : compact ? 'text-base' : 'text-xl'}`}>Duke University<br />Student Athlete</div>
          <div className={`${mobileProfile ? 'text-base' : compact ? 'text-base' : 'text-xl'}`}>Undergraduate Researcher</div>
        </div>
      </div>
      {/* Resume Button */}
      <div className={`flex justify-center w-full mt-1 ${mobileProfile ? 'mb-0' : ''} ${compact ? 'text-xs' : ''}`} style={mobileProfile ? { marginTop: 'auto' } : {}}>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 ${mobileProfile ? 'text-xs py-1 rounded-lg w-[300px]' : compact ? 'text-xs py-1 rounded-lg w-[90px]' : 'text-lg font-semibold py-3 rounded-xl w-[300px]'} bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors`}
        >
          <FaDownload className={`${mobileProfile ? 'w-4 h-4' : compact ? 'w-4 h-4' : 'w-6 h-6'}`} /> Resume
        </a>
      </div>
    </div>
  );
}