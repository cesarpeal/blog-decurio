<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

//Rutas controlador usuarios
Route::post('/api/register', 'UserController@register');
Route::post('/api/login', 'UserController@login');
//Route::put('/api/update', 'UserController@update');

//Rutas del controlador categorías
//Route::resource('api\category', 'CategoryController');

//Rutas del controlador entradas
Route::resource('/api/topic', 'TopicController');
Route::post('/api/topic/upload', 'TopicController@upload');
Route::get('/api/lasttopics', 'TopicController@LastTopics');
Route::get('/api/topic/image/{filename}', 'TopicController@getImage');
Route::get('/api/topic/topics/{category_id}/{game_id?}', 'TopicController@getGamesTopics');
Route::get('/api/topic/search/{busqueda}', 'TopicController@search');

Route::resource('/api/game', 'GameController');
Route::post('/api/game/upload', 'GameController@upload');
Route::get('/api/game/image/{filename}', 'GameController@getImage');