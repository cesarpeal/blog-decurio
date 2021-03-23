<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Topic;
use App\Category;

class pruebasController extends Controller
{
	public function prueba(){
		$categories = Category::all();
		$topics = Topic::all();
		foreach($categories as $category){
			echo "<h1>".$category->title."</h1>";
			foreach($category->topics as $topic){
				echo "<h2>".$topic->title."</h2>";
				echo "<p>".$topic->content."</p>";
			}
		}
	}
}
