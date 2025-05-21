'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function About() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState({
    text: "",
    links: {
      athlete: "",
      lab: "",
      drFerreira: "",
      profIversen: ""
    }
  });
  const [imageVersion, setImageVersion] = useState(Date.now());

  useEffect(() => {
    async function fetchBio() {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const data = await res.json();
          setBio(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchBio();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bio),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const renderBio = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <textarea
            value={bio.text}
            onChange={(e) => setBio({ ...bio, text: e.target.value })}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    const parts = bio.text.split(/(Division 1 Cross Country and Track Athlete|Ferreira Lab|Dr\. Leonardo Ferreira|Professor Edwin Iversen)/);
    return (
      <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
        {parts.map((part, index) => {
          if (part === "Division 1 Cross Country and Track Athlete") {
            return (
              <a
                key={index}
                href={bio.links.athlete}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                {part}
              </a>
            );
          }
          if (part === "Ferreira Lab") {
            return (
              <a
                key={index}
                href={bio.links.lab}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                {part}
              </a>
            );
          }
          if (part === "Dr. Leonardo Ferreira") {
            return (
              <a
                key={index}
                href={bio.links.drFerreira}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                {part}
              </a>
            );
          }
          if (part === "Professor Edwin Iversen") {
            return (
              <a
                key={index}
                href={bio.links.profIversen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                {part}
              </a>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <div className="flex justify-start items-start min-h-[60vh] p-8">
      <div className="flex flex-row items-start w-full max-w-6xl">
        {/* Left: Large rectangular profile image */}
        <div className="flex flex-col items-center w-96 flex-shrink-0">
          <div className="h-[32rem] w-full bg-gray-200 overflow-hidden border-2 border-primary-600" style={{ boxSizing: 'border-box' }}>
            <Image
              src={`/profile.jpg?v=${imageVersion}`}
              alt="Profile picture"
              width={384}
              height={512}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Social links and resume button below the image */}
          <div className="flex justify-center space-x-6 mt-6 w-full">
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
        </div>
        {/* Right: Name and subtitle */}
        <div className="ml-16 flex flex-col justify-center">
          <h1 className="text-7xl font-extrabold mb-4 tracking-tight">
            William Joseph Skelly
          </h1>
          <p className="text-3xl text-gray-600 mb-6 font-semibold tracking-tight">
            Undergraduate at Duke University
          </p>
          <div className="flex items-center text-xl text-gray-600 mb-8">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <a href="mailto:william.skelly@duke.edu" className="hover:text-primary-600 transition-colors font-semibold">
              william.skelly@duke.edu
            </a>
          </div>
          <div className="relative">
            {renderBio()}
            {session?.user?.role === 'admin' && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 