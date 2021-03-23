<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $table = 'topics';
    protected $fillable = ['title', 'content', 'updated_at', 'image', 'description', 'link'];

    public function user(){
    	return $this->belongsTo('App\User', 'user_id');
    }

    public function category(){
    	return $this->belongsTo('App\Category', 'category_id');
    }

    public function game(){
    	return $this->belongsTo('App\Game', 'game_id');
    }
}
