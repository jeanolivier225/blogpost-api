import { useEffect, useState } from "react";
import { protectedApi } from "../../services/http.service";
import ArticleCard from "../../components/ArticleCard";

const PostsFeed = () => {

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            setLoading(true);
            const response = await protectedApi.getPostsFeed();
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 justify-center">
                {posts.map((post: any) => (
                    <ArticleCard key={post.id} article={post} />
                ))}
            </div>



        </>
    );

};

export default PostsFeed;



