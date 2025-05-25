import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaDownload, FaEnvelope } from "react-icons/fa";
import ProfileCard from "./components/ProfileCard";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import { IProject } from "@/models/Project";
import { Types } from "mongoose";
import { getApiUrl } from '@/lib/apiUrl';

async function getFeaturedProjects() {
  const res = await fetch(getApiUrl('/api/projects?featured=true'), {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch featured projects');
  return res.json();
}

export default async function Home() {
  const featuredProjects: (IProject & { _id: Types.ObjectId })[] = await getFeaturedProjects();
  console.log('Featured Projects:', featuredProjects);

  return (
    <main className="page-container pt-6">
      <section className="flex flex-row items-center justify-between gap-2 mt-0 px-1 sm:px-4">
        {/* Featured Projects Section (left) */}
        <div className="w-1/2 flex flex-col items-center justify-center -mt-10">
          <section className="w-full max-w-full">
            <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 text-center whitespace-nowrap">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {featuredProjects.slice(0, 3).map((project) => (
                <FeaturedProjectCard
                  key={project._id.toString()}
                  project={project}
                  compact
                  mobileSquare
                />
              ))}
            </div>
            <div className="mt-2 md:mt-4 flex justify-center w-full">
              <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-lg">
                View All Projects →
              </Link>
            </div>
          </section>
        </div>
        {/* Profile Card (right) */}
        <div className="w-1/2 flex flex-col justify-center items-center -mt-20">
          <ProfileCard compact mobileProfile />
          {/* Connect With Me Section */}
          <section className="w-full flex flex-col items-center mt-2">
            <h2 className="text-base font-semibold mb-2">Connect With Me</h2>
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
