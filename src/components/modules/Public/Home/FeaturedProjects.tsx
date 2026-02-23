import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { getProjects } from '@/services/project/projects';
import { Suspense } from 'react';
import FeaturedCard from './FeaturedCard';
import FeaturedProjectSkeleton from './FeaturedProjectSkeleton';

const FeaturedProjectsSlider = async () => {
  const params = { isFeatured: true };
  const { data } = await getProjects(params);

  return (
    <Container className="text-center">
      <SectionHeading
        heading="Featured Projects"
        description="A showcase of my work blending creativity and functionality."
      />
      <Suspense fallback={<FeaturedProjectSkeleton />}>
        <FeaturedCard projects={data} />
      </Suspense>
    </Container>
  );
};

export default FeaturedProjectsSlider;
