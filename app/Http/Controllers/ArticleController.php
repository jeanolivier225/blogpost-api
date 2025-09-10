<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{

    private function query(Request $request)
    {
        $query = Article::query();

        if ($search = $request->query('search')) {
            $query->where([
                ['articles.title', 'LIKE', "%{$search}%"],
                ['articles.description', 'LIKE', "%{$search}%", 'or'],
                ['articles.content', 'LIKE', "%{$search}%", 'or'],
            ]);
        }

        $query->where(function ($query) use ($request) {

            $query->when($sourceId = $request->query('source_id'), function ($query) use ($sourceId) {
                $query->where('articles.source_id', '=', $sourceId);
            });

            $query->when($authorId = $request->query('author_id'), function ($query) use ($authorId) {
                $query->orWhere('articles.author_id', '=', $authorId);
            });

            $query->when($categoryId = $request->query('category_id'), function ($query) use ($categoryId) {
                $query->orWhere('articles.category_id', '=', $categoryId);
            });

        });

        $query
            ->orderBy('articles.published_at')
            ->with([
                'author',
                'source',
                'category',
            ]);

        return $query;
    }

    public function index(Request $request)
    {
        $articles = $this->query($request)->paginate(15);

        return ArticleResource::collection($articles);
    }

    public function feed(Request $request)
    {
        $user = $this->user($request);

        $query = $this->query($request);

        $query->where(function ($query) use ($user) {

            $query
                ->whereIn('articles.source_id', $user->pref_sources()->selectRaw('sources.id'))
                ->orWhereIn('articles.author_id', $user->pref_authors()->selectRaw('authors.id'))
                ->orWhereIn('articles.category_id', $user->pref_categories()->selectRaw('categories.id'));

        });

        $articles = $query->paginate(15);

        return ArticleResource::collection($articles);
    }

    public function show($slug)
    {
        $article = Article::where('slug', '=', $slug)->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        $article->load([
            'category',
            'source',
            'author'
        ]);

        return new ArticleResource($article);
    }


}
