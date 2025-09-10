<?php

namespace App\Http\Controllers;

use App\Http\Resources\SourceResource;
use App\Models\Source;
use Illuminate\Http\Request;

class SourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Source::query();

        if ($search = $request->query('search')) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        }

        $query->orderBy('name');

        if($request->has('noPaginate')) {
            $sources = $query->get();
        }
        else {
            $sources = $query->paginate($request->query('perPage', 50));
        }

        return SourceResource::collection($sources);
    }

}
