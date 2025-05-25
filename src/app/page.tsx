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
      <main className="page-container pt-6 min-h-screen max-w-screen-xl mx-auto px-4">
        <section className="flex flex-col items-center justify-start gap-4 mt-0 px-1 sm:px-4 w-full pt-4">
          {/* Profile Card at the top */}
          <div className="w-full flex flex-col justify-center items-center">
            <ProfileCardPhone />
          </div>
          {/* Featured Projects underneath */}
          <div className="w-full flex flex-col items-center justify-center mt-2">
            <h2 className="text-3xl font-extrabold mb-6 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-4 w-full">
              {featuredProjects.slice(0, 3).map((project, idx) => (
                <FeaturedProjectCardPhone
                  key={typeof project._id === 'string' ? project._id : idx}
                  project={project}
                />
              ))}
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 text-xl font-semibold py-1 rounded-lg w-[300px] mx-auto bg-[#e9f1ff] dark:bg-[#5f6c89] text-[#2E2F35] shadow hover:bg-primary-100 transition-colors"
              >
                View All Projects →
              </Link>
            </div>
            <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2"></div>
            {/* Interests section for mobile */}
            <div className="w-[300px] mx-auto bg-[#e9f1ff] text-[#2E2F35] text-center rounded-xl py-3 px-3 mt-4 text-lg">
              When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
            </div>
            {/* Connect With Me section for mobile */}
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
              <a href="mailto:william.skelly@duke.edu" className="text-center text-[#2E2F35] hover:text-primary-600 transition-colors underline text-base md:text-lg">
                william.skelly@duke.edu
              </a>
            </div>
            <div className="w-[300px] h-2 bg-[#034ed2] rounded-b-xl mt-2 mx-auto"></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container pt-10 max-w-screen-2xl mx-auto px-4 text-xl">
      <section className="flex flex-row items-end justify-between gap-x-12 mt-0">
        {/* Featured Projects Section (left) */}
        <div className="md:w-2/3 w-full md:ml-12 min-w-0 md:min-w-[400px]">
          <div className="flex flex-row items-center justify-between mb-6 min-w-0 overflow-hidden">
            <h2
              className="font-extrabold text-left whitespace-nowrap"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            >
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="font-semibold text-primary-700 underline hover:text-blue-600 transition-colors duration-200 ml-4 whitespace-nowrap"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            >
              View All Projects →
            </Link>
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-3 gap-4">
              {featuredProjects.slice(0, 3).map((project, idx) => (
                <FeaturedProjectCard
                  key={typeof project._id === 'string' ? project._id : idx}
                  project={project}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-[#e9f1ff] text-[#2E2F35] text-center rounded-xl py-3 px-3 mt-12 text-lg mx-auto">
            When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
          </div>
          <div className="w-full flex flex-col items-center mt-4 mb-2">
            <div className="flex flex-row items-center justify-center gap-8 w-full max-w-xl">
              <span className="text-xl font-bold text-[#2E2F35]">Connect With Me</span>
              <div className="flex gap-6">
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
          </div>
          <div className="w-full h-2 bg-[#034ed2] rounded-b-xl mt-2"></div>
        </div>

        {/* Profile Section (right) */}
        <div className="md:w-1/3 w-full flex flex-col items-center justify-end h-full min-w-0 md:min-w-[350px]">
          <ProfileCard />
        </div>
      </section>
    </main>
  );
}
