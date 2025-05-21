import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaDownload, FaEnvelope } from "react-icons/fa";
import ProfileCard from "./components/ProfileCard";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import { IProject } from "@/models/Project";
import { Types } from "mongoose";

async function getFeaturedProjects() {
  const res = await fetch(`/api/projects?featured=true`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch featured projects');
  return res.json();
}

export default async function Home() {
  const featuredProjects: (IProject & { _id: Types.ObjectId })[] = await getFeaturedProjects();
  console.log('Featured Projects:', featuredProjects);

  return (
    <main className="page-container pt-4">
      <section className="flex flex-row items-start gap-8 mt-2">
        {/* Featured Projects Section */}
        <div className="flex-1 min-w-0">
          <section className="max-w-3xl ml-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
              <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
                View All Projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard key={project._id.toString()} project={project} />
              ))}
            </div>
          </section>
        </div>
        <div className="mr-[-6rem] mt-[-2rem] relative z-10">
          <ProfileCard />
        </div>
      </section>

      {/* Personal Interests & Social Links */}
      <section className="max-w-4xl mx-auto text-center mt-2">
        <h2 className="text-base font-semibold mb-2">Connect With Me</h2>
        <div className="flex justify-center gap-6 mb-4">
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
        <p className="text-base text-neutral-600 whitespace-nowrap overflow-x-auto">
          When I'm not coding or running, you can find me listening to philosophy podcasts, writing screenplays, or watching movies.
        </p>
      </section>
    </main>
  );
}
