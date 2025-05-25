'use client';

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaDownload, FaEnvelope } from "react-icons/fa";
import ProfileCard from "./components/ProfileCard";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import { IProject } from "@/models/Project";
import { Types } from "mongoose";
import { getApiUrl } from '@/lib/apiUrl';
import { useMediaQuery } from 'react-responsive';
import FeaturedProjectCardPhone from './components/FeaturedProjectCardPhone';
import ProfileCardPhone from './components/ProfileCardPhone';
import { useEffect, useState } from 'react';

export default function Home() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [mounted, setMounted] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<IProject[]>([]);

  useEffect(() => {
    setMounted(true);
    async function fetchProjects() {
      const res = await fetch(getApiUrl('/api/projects?featured=true'), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setFeaturedProjects(data);
      }
    }
    fetchProjects();
  }, []);

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <main className="page-container pt-6 min-h-screen">
        <section className="flex flex-col items-center justify-start gap-4 mt-0 px-1 sm:px-4 w-full pt-4">
          {/* Profile Card at the top */}
          <div className="w-full flex flex-col justify-center items-center">
            <ProfileCardPhone />
          </div>
          {/* Featured Projects underneath */}
          <div className="w-full flex flex-col items-center justify-center mt-2">
            <h2 className="text-3xl font-extrabold mb-2 text-center whitespace-nowrap">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-4 w-full">
              {featuredProjects.slice(0, 3).map((project, idx) => (
                <FeaturedProjectCardPhone
                  key={typeof project._id === 'string' ? project._id : idx}
                  project={project}
                />
              ))}
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 text-xs py-1 rounded-lg w-[300px] mx-auto bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors font-semibold text-lg"
              >
                View All Projects →
              </Link>
            </div>
            <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2"></div>
            <div className="mt-6 w-full flex flex-col items-center">
              <h2 className="text-3xl font-extrabold mb-2">Connect With Me</h2>
              <div className="flex justify-center gap-6 mb-2">
                <a href="https://www.linkedin.com/in/william-skelly/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
                </a>
                <a href="https://github.com/Wskelly1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FaGithub className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
                </a>
                <a href="https://www.instagram.com/will.skellt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
                </a>
              </div>
            </div>
            <div className="w-[300px] mx-auto bg-[#e9f1ff] text-[#2E2F35] text-center rounded-xl py-3 px-3 mt-4 text-sm">
              When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
            </div>
            <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2 mx-auto"></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container pt-6">
      <section className="flex flex-row items-center justify-between gap-2 mt-0 px-1 sm:px-4">
        {/* Featured Projects Section (left) */}
        <div className="w-1/2 flex flex-col items-center justify-center -mt-10">
          <section className="w-full max-w-full">
            <h2 className="text-3xl font-extrabold mb-2 text-center whitespace-nowrap">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {featuredProjects.slice(0, 3).map((project, idx) => (
                <FeaturedProjectCard
                  key={typeof project._id === 'string' ? project._id : idx}
                  project={project}
                  compact
                  mobileSquare
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center w-full">
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 text-xs py-1 rounded-lg w-[300px] mx-auto bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors font-semibold text-lg"
              >
                View All Projects →
              </Link>
            </div>
            <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2"></div>
          </section>
        </div>
        {/* Profile Card (right) */}
        <div className="w-1/2 flex flex-col justify-center items-center -mt-20">
          <ProfileCard compact mobileProfile />
          {/* Connect With Me Section */}
          <section className="w-full flex flex-col items-center mt-2">
            <h2 className="text-3xl font-extrabold mb-2">Connect With Me</h2>
            <div className="flex justify-center gap-6 mb-1">
              <a href="https://www.linkedin.com/in/william-skelly/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
              </a>
              <a href="https://github.com/Wskelly1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
              </a>
              <a href="https://www.instagram.com/will.skellt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-3xl text-primary-600 hover:text-primary-700 transition-colors" />
              </a>
            </div>
            <a href="mailto:william.skelly@duke.edu" className="text-center text-[#2E2F35] hover:text-primary-600 transition-colors underline text-base md:text-lg">
              william.skelly@duke.edu
            </a>
          </section>
          <div className="w-[300px] mx-auto bg-[#e9f1ff] text-[#2E2F35] text-center rounded-xl py-3 px-3 mt-4 text-sm">
            When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
          </div>
          <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2 mx-auto"></div>
        </div>
      </section>
      {/* Personal Interests */}
      <section className="max-w-4xl mx-auto text-center mt-8 px-4">
        <p className="text-base text-neutral-600 overflow-x-auto">
          When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
        </p>
      </section>
    </main>
  );
}
