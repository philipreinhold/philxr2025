import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../../Layout/PageWrapper';
import { useLanguageStore } from '../../../store/languageStore';

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
}

export default function Blog() {
  const { language } = useLanguageStore();
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediumPosts = async () => {
      try {
        // Hier können wir später die Medium RSS-Feed URL einfügen
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@your-medium-username');
        const data = await response.json();
        
        const formattedPosts = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: new Date(item.pubDate).toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE'),
          thumbnail: item.thumbnail || '/images/blog-placeholder.jpg',
          description: item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Fehler beim Laden der Blog-Beiträge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediumPosts();
  }, [language]);

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  max-w-4xl w-full mx-auto p-8 
                  bg-white/40 backdrop-blur-sm rounded-sm border border-white/20 
                  pointer-events-auto"
      >
        <h1 className="text-3xl font-light mb-8 text-black">
          {language === 'en' ? 'Blog' : 'Blog'}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <motion.article
                key={post.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-sm overflow-hidden hover:bg-white/80 transition-colors"
              >
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-light mb-2 text-black">
                      {post.title}
                    </h2>
                    <p className="text-sm text-neutral-600 mb-4">
                      {post.description}
                    </p>
                    <div className="text-xs text-neutral-500">
                      {post.pubDate}
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
} 