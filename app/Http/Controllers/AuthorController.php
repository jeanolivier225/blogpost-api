<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $query = Author::query();

        if ($search = $request->query('search')) {
            $query->where('full_name', 'LIKE', '%' . $search . '%');
        }

        $query->orderBy('full_name');

        if($request->has('noPaginate')) {
            $authors = $query->get();
        }
        else {
            $authors = $query->paginate($request->query('perPage', 50));
        }

        return AuthorResource::collection($authors);
    }
}
