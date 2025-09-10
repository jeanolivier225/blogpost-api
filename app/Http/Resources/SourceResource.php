<?php

namespace App\Http\Resources;

use App\Models\Source;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Source */
class SourceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'articles_count' => $this->articles_count,
        ];
    }
}
