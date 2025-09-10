import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Auth from './pages/Auth/Auth.tsx';
import Posts from "./pages/Posts/Posts.tsx";
import Layout from './layout/Layout.tsx';
import { authService } from './services/http.service.ts';
import Post from './pages/Posts/Post.tsx';
import PostsFeed from './pages/Posts/PostFeed.tsx';
import ProfileForm from './pages/Profil/Profil.tsx';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/auth/:action?" element={<Auth />} />

        <Route path="/*" element={
          !authService.isAuthenticated() ? <Navigate to="/auth" /> : <Layout>
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/feeds" element={<PostsFeed />} />
              <Route path="/profil" element={<ProfileForm />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/posts" element={<Posts />} />
              {/* Ajoutez ici vos autres routes */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </div>
  )
}

export default App
