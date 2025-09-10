import {useEffect, useState} from "react";
import {protectedApi} from "../../services/http.service";
import ArticleCard from "../../components/ArticleCard";
import SearchForm from "../../components/SearchForm";
import {useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";

const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(true);
    const [query] = useSearchParams();

    const getPosts = async (search?: string, author_id?: string, source_id?: string, category_id?: string) => {
        try {
            setFiltering(true);
            const response = await protectedApi.getPosts(search, author_id, source_id, category_id);
            setPosts(response.data);
            setFiltering(false);
        } catch (error) {
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    const handleFiltre = (values: any) => {
        getPosts(values.search, values.author_id, values.source_id, values.category_id);
    };

    const handleReset = () => {
        getPosts();
    };


    useEffect(() => {
        const search: string = query.get('search') || '';
        const authorId: string = query.get('author_id') || '';
        const sourceId: string = query.get('source_id') || '';
        const categoryId: string = query.get('category_id') || '';
        getPosts(search, authorId, sourceId, categoryId);
    }, []);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>

            <SearchForm onSubmit={handleFiltre} onReset={handleReset} />

            {filtering ? <LoadingSpinner /> :  (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 justify-center mt-7">
                    {posts.map((post: any) => (
                        <ArticleCard key={post.id} article={post} />
                    ))}
                </div>
            )}

        </>
    );

};

export default Posts;



