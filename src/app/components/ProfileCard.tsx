import Image from 'next/image';
import Link from 'next/link';
import { FaDownload, FaUniversity, FaFlask, FaEnvelope } from 'react-icons/fa';

export default function ProfileCard() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center h-full justify-between z-0">
      {/* Silo Background and Large Image */}
      <div className="relative w-[340px] flex flex-col items-center flex-shrink-0 h-full -mt-24" style={{ height: '380px' }}>
        {/* Background: fixed size and position */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[340px] h-[380px] bg-[#e9f1ff] dark:bg-[#5f6c89] rounded-t-full rounded-b-2xl z-0 shadow-md" />
        {/* Image: much larger, bottom aligned, pops out above background */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-end justify-center z-10 w-[420px] h-[420px]">
          <Image
            src="/profile-transparent.png"
            alt="William Skelly"
            width={420}
            height={420}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
      {/* Tightly Centered Info Section between image and button */}
      <div className="flex flex-col items-center w-[340px] flex-1 justify-between h-full py-2" style={{ minHeight: '60px', justifyContent: 'center', marginTop: '8px', marginBottom: '0' }}>
        <div className="flex flex-col items-center text-center space-y-2 w-full flex-1 justify-center my-auto">
          <div className="text-base flex items-center w-full pl-2">
            <span className="w-6 flex-shrink-0 text-left"><FaUniversity className="text-primary-600 w-5 h-5" /></span>
            <span className="flex-1 text-center">Duke University Student Athlete</span>
          </div>
          <div className="text-base flex items-center w-full pl-2">
            <span className="w-6 flex-shrink-0 text-left"><FaFlask className="text-primary-600 w-5 h-5" /></span>
            <span className="flex-1 text-center">Undergraduate Researcher</span>
          </div>
          <a href="mailto:william.skelly@duke.edu" className="text-center text-[#2E2F35] hover:text-primary-600 transition-colors underline text-base flex items-center w-full pl-2">
            <span className="w-6 flex-shrink-0 text-left"><FaEnvelope className="text-primary-600 w-5 h-5" /></span>
            <span className="flex-1 text-center">william.skelly@duke.edu</span>
          </a>
        </div>
      </div>
      {/* Resume Button */}
      <div className="flex justify-center w-[340px] mt-1 mb-0">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xl py-1 rounded-lg w-[340px] bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors"
        >
          <FaDownload className="w-4 h-4" /> Resume
        </a>
      </div>
      <div className="w-[340px] h-2 bg-[#034ed2] rounded-b-xl mt-2"></div>
    </div>
  );
}