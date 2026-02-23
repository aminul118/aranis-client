'use client';

import BackButton from '@/components/common/button/back-button';
import DateFormat from '@/components/common/formater/date-format';
import HtmlContent from '@/components/rich-text/core/html-content';
import { Button } from '@/components/ui/button';
import GradientTitle from '@/components/ui/gradientTitle';
import { IProject } from '@/types';
import { Pencil, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import EditProject from './EditProject';

interface Props {
  project: IProject;
}

const ProjectViewWithEdit = ({ project }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!project) return null;

  return (
    <div className="container mx-auto w-11/12 space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <GradientTitle title={project.title} className="text-left" />

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <BackButton label="Back" />
              <Button onClick={() => setIsEditing(true)}>
                <Pencil />
                Edit
              </Button>
            </>
          ) : (
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              <X /> Cancel
            </Button>
          )}
        </div>
      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="space-y-6">
          {/* Thumbnail */}
          <div>
            <Image
              src={project.thumbnail}
              width={1280}
              height={720}
              alt={project.title}
            />
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Slug:</p>
              <p className="text-sm opacity-80">{project.slug}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Live Link:</p>
              <Link
                href={project.liveLink}
                target="_blank"
                className="text-sm text-blue-500 underline"
              >
                {project.liveLink}
              </Link>
            </div>

            {!!project.github && (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">GitHub:</p>
                <Link
                  href={project.github}
                  target="_blank"
                  className="text-sm text-blue-500 underline"
                >
                  {project.github}
                </Link>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold">Technologies:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technology?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <HtmlContent content={project.content} />

            {project.photos?.length ? (
              <div>
                <p className="text-sm font-semibold">Gallery:</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  {project.photos.map((photo, idx) => (
                    <Image
                      key={idx}
                      src={photo}
                      width={500}
                      height={350}
                      alt="Project photo"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="border-t pt-4 text-xs opacity-70">
              <p>Featured: {project.isFeatured ? 'Yes' : 'No'}</p>
              <p>
                Created: <DateFormat date={project.createdAt} />
              </p>
              <p>
                Updated: <DateFormat date={project.updatedAt} />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <EditProject
          project={project}
          onCancel={() => setIsEditing(false)}
          onUpdated={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProjectViewWithEdit;
