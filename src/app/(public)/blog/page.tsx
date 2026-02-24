import Container from '@/components/ui/Container';

const BlogPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        Our Blog
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        Stay tuned for the latest tech news, reviews, and buying guides from our
        tech experts.
      </p>
    </Container>
  );
};

export default BlogPage;
