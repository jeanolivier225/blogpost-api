<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'verified_at' => $this->verified_at,
            'verified' => $this->verified,
            'password' => $this->password,
            'remember_token' => $this->remember_token,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'notifications_count' => $this->notifications_count,
            'pref_authors_count' => $this->pref_authors_count,
            'pref_categories_count' => $this->pref_categories_count,
            'pref_sources_count' => $this->pref_sources_count,
            'read_notifications_count' => $this->read_notifications_count,
            'tokens_count' => $this->tokens_count,
            'unread_notifications_count' => $this->unread_notifications_count,

            'pref_authors' => AuthorResource::collection($this->whenLoaded('pref_authors')),
            'pref_categories' => CategoryResource::collection($this->whenLoaded('pref_categories')),
            'pref_sources' => SourceResource::collection($this->whenLoaded('pref_sources')),
        ];
    }
}
