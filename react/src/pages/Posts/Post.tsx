import {useParams} from "react-router-dom";
import {protectedApi} from "../../services/http.service";
import {useEffect, useState} from "react";
import {ArrowLeft, Calendar, Check, Copy, ExternalLink, Globe, Share2, User} from 'lucide-react';
import type {ArticleData} from "../../models/Models/Article.tsx";


const Post = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState<ArticleData>({} as ArticleData);
    const [loading, setLoading] = useState(true);

    const getPost = async () => {
        try {
            setLoading(true);
            const response = await protectedApi.getPost(slug);
            setArticle(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getPost();
    }, []);

    const [copied, setCopied] = useState(false);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  };


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };


  const handleReadOriginal = () => {
    window.open(article.external_url, '_blank', 'noopener,noreferrer');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
}

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to articles</span>
          </button>
        </div>
      </header>


      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">

          <div className="aspect-video w-full overflow-hidden">
            <img
              src={article.img_url}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>


          <div className="p-8">

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <Globe size={12} />
                {article?.source?.name || '-'}
              </div>
            </div>


            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>


            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium">{article?.author?.full_name || '-'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(article?.published_at)}</span>
              </div>
            </div>


            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleReadOriginal}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                <ExternalLink size={16} />
                Read the complete article
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Copied !' : 'Copy the link'}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Share2 size={16} />
                Share
              </button>
            </div>


            <div className="prose max-w-none">
              <div className="bg-gray-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Post resume</h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {article.description}
                </p>
              </div>


              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Continue read
                </h3>
                <p className="text-blue-700 mb-4">
                  Read article from the source {article?.source?.name}.
                </p>
                <button
                  onClick={handleReadOriginal}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <ExternalLink size={18} />
                  Read on {article?.source?.name}
                </button>
              </div>
            </div>
          </div>
        </article>


        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">

            </div>
            <div>
              <h4 className="font-medium text-gray-900">{article?.author?.full_name || '-'}</h4>
              <p className="text-gray-600 text-sm mt-1">
                Source {article?.source?.name || '-'}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Post;
