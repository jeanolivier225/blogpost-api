<?php

namespace App\Console\Commands;

use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Carbon\Carbon;
use Illuminate\Http\Client\Pool;
use Illuminate\Console\Command;

class FetchFeedCommand extends Command
{
    protected $signature = 'fetch:feed';

    protected $description = 'Command description';

    public function handle(): void
    {
        $responses = \Http::pool(function (Pool $pool) {

            $q = "china";

            $perPage = 100;

            $newsApiKey = env("NEWSAPI_KEY");

            $nyTimesApiKey = env("NYTIMES_API_KEY");

            $theGuardianApiKey = env("THEGUARDIAN_API_KEY");

            $array = [];

            $from = now()->subDays(1)->format('Y-m-d');
            $to = now()->format('Y-m-d');

            if($newsApiKey) {
                $array[] = $pool->as('newsapi.org')->get("https://newsapi.org/v2/everything?q=${q}&pageSize=${perPage}&from=${from}&to=${to}&apiKey=${newsApiKey}");
            }

            if($nyTimesApiKey) {
                $from = now()->subDays(1)->format('Ymd');
                $to = now()->format('Ymd');
                $array[] = $pool->as('nytimes.com')->get("https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${q}&begin_date=${from}&end_date=${to}&sort=newest&api-key=${nyTimesApiKey}");
            }

            if($theGuardianApiKey) {
                $array[] = $pool->as('guardianapis.com')->get("https://content.guardianapis.com/search?q=${q}&from-date=${from}&from-date=${to}&page-size=${perPage}&api-key=${theGuardianApiKey}&show-fields=all");
            }

            return $array;

        });

        foreach ($responses as $name => $response) {

            switch ($name) {

                case 'newsapi.org':
                    $this->processNewsApiFeed($response);
                    break;

                case 'nytimes.com':
                    $this->processNYTimesApiFeed($response);
                    break;

                case 'guardianapis.com':
                    $this->processGuardiansApiFeed($response);
                    break;

            }

        }

    }


    private function processNewsApiFeed($feed)
    {
        $articles = \Arr::get($feed, 'articles', []);

        foreach ($articles as $article) {

            try {
                $this->saveArticle(
                    \Arr::get($article, 'source.name'),
                    \Arr::get($article, 'author'),
                    null,
                    \Arr::get($article, 'title'),
                    \Arr::get($article, 'description'),
                    \Arr::get($article, 'url'),
                    \Arr::get($article, 'urlToImage'),
                    \Arr::get($article, 'publishedAt')
                );
            } catch (\Exception $exception) {
                throw $exception;
            }

        }
    }


    private function processNYTimesApiFeed($feed)
    {
        $articles = \Arr::get($feed, 'response.docs', []);

        foreach ($articles as $article) {

            try {
                $this->saveArticle(
                    \Arr::get($article, 'source'),
                    \Arr::get($articles, 'byline.original'),
                    \Arr::get($article, 'news_desk'),
                    \Arr::get($article, 'headline.main'),
                    \Arr::get($article, 'snippet'),
                    \Arr::get($article, 'web_url'),
                    \Arr::get($article, 'multimedia.default.url'),
                    \Arr::get($article, 'pub_date')
                );
            } catch (\Exception $exception) {
                throw $exception;
            }

        }

    }


    private function processGuardiansApiFeed($feed)
    {
        $articles = \Arr::get($feed, 'response.results', []);

        foreach ($articles as $article) {

            try {
                $this->saveArticle(
                    \Arr::get($article, 'fields.publication'),
                    \Arr::get($article, 'fields.byline'),
                    \Arr::get($article, 'sectionName'),
                    \Arr::get($article, 'webTitle'),
                    \Arr::get($article, 'fields.bodyText'),
                    \Arr::get($article, 'webUrl'),
                    \Arr::get($article, 'fields.thumbnail'),
                    \Arr::get($article, 'webPublicationDate')
                );
            } catch (\Exception $exception) {
                throw $exception;
            }

        }
    }

    private function source($name): ?Source
    {
        if(!$name) return null;

        $slug = \Str::slug($name);

        $source = Source::where('slug', '=', $slug)->first();

        if(!$source) {
            return (Source::create([
                'slug' => $slug,
                'name' => $name,
            ]))->fresh();
        }

        return $source;

    }

    private function author($name): ?Author
    {
        if(!$name) return null;

        $slug = \Str::slug($name);

        $author = Author::where('slug', '=', $slug)->first();

        if(!$author) {
            return (Author::create([
                'full_name' => $name,
                'slug' => $slug
            ]))->fresh();
        }

        return $author;
    }

    public function saveArticle($sourceName, $authorName, $categoryName, $title, $description, $postUrl, $imgUrl, $publishedAt)
    {
        \DB::table('articles')->insert([
            'source_id' => $sourceName ? $this->source($sourceName)->id : null,
            'author_id' => $authorName ? $this->author($authorName)->id : null,
            'category_id' => $categoryName ? $this->category($categoryName)->id : null,
            'title' => $title,
            'description' => $description,
            'external_url' => $postUrl,
            'img_url' => $imgUrl,
            'slug' => \Str::slug($title),
            'published_at' => $publishedAt ? Carbon::parse($publishedAt)->toDateTimeString() : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function category($name): ?Category
    {
        if(!$name) return null;

        $slug = \Str::slug($name);

        $category = Category::where('slug', '=', $slug)->first();

        if(!$category) {
            return (Category::create([
                'name' => $name,
                'slug' => $slug
            ]))->fresh();
        }

        return $category;
    }
}
