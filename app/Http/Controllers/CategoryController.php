<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($search = $request->query('search')) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        }

        $query->orderBy('name');

        if($request->has('noPaginate')) {
            $categories = $query->get();
        }
        else {
            $categories = $query->paginate($request->query('perPage', 50));
        }

        return CategoryResource::collection($categories);
    }
}
