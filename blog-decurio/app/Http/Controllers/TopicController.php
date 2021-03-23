<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Helpers\JwtAuth;
use App\Topic;
use App\Game;
use App\Category;

class TopicController extends Controller
{
    

    public function index(){
    	$topics = Topic::all();
    
	    	return response()->json([
		    	'code' => 200,
		    	'status' => 'success',
		    	'topics' => $topics
	    	]);
	    }

	  public function show($id){
	  	$topic = Topic::find($id)->load('category');


	  	if(is_object($topic)){
	  		$data = [
	  			'code' => 200,
	  			'status' => 'success',
	  			'topic' => $topic
	  		];
	  	}else{
	  		$data =[
	  			'code' => 404,
	  			'status' => 'error',
	  			'message' => 'La entrada no existe'
	  		];
	  	}

	  	return response()->json($data, $data['code']);
	  }

	  public function LastTopics(){
	  	$topicLast = Topic::with('Game')->latest()
	  					->take(6)
	  					->get();

	  	if(is_object($topicLast)){
	  		$data = [
	  			'code' => 200,
	  			'status' => 'success',
	  			'topics' => $topicLast
	  		];
	  	}else{
	  		$data =[
	  			'code' => 404,
	  			'status' => 'error',
	  			'message' => 'No hay posts para mostrar'
	  		];
	  	}

	  	return response()->json($data, $data['code']);
	  }

	  public function store(Request $request){
	  	//Recoger los datos por POST
	  	$json = $request->input('json', null);
	  	$params = json_decode($json);
	  	$params_array = json_decode($json, true);


	  	if(!empty($params_array)){
	  		//Conseguir usuario identificado
	  		$user = $this->getIdentity($request);
	  		//Validar los datos
	  		$validate = \Validator::make($params_array, [
	  			'title' => 'required',
	  			'content' => 'required',
	  			'category_id' => 'required',
	  			'image' => 'nullable',
	  			'game_id' => 'required',
	  			'description' => 'nullable',
	  			'link' => 'nullable'
	  		]);

	  		if($validate->fails()){
	  			$data = [
	  				'code' => 400,
	  				'status' => 'error',
	  				'message' => 'Faltan datos'
	  			];
	  		}else{
	  			//Guardar el artículo
	  			$topic = new Topic();
	  			$topic->user_id = $user->sub;
	  			$topic->category_id = $params->category_id;
	  			$topic->title = $params->title;
	  			$topic->content = $params->content;
	  			$topic->image = $params->image;
	  			$topic->game_id = $params->game_id;
	  			$topic->description = $params->description;
	  			$topic->link = $params->link;
	  			$topic->save();

	  			$data = [
		  			'code' => 200,
		  			'status' => 'success',
		  			'topic' => $topic
	  			];
	  		}
	  	}else{

	  		$data = [
	  			'code' => 400,
	  			'status' => 'error',
	  			'message' => 'Envía los datos correctamente'
	  		];
	  	}
	  	

	  	//Devolver respuesta
	  	return response()->json($data, $data['code']);
	  }

	  public function update($id, Request $request){
	  	$json = $request->input('json', null);
	  	$params_array = json_decode($json, true);

	  	$data = array(
	  		'code' => 400,
	  		'status' => 'error',
	  		'message' => 'Error al actualizar'
	  	);

	  	if(!empty($params_array)){
			$validate = \Validator::make($params_array, [
	  			'title' => 'required',
	  			'content' => 'required'
	  		]);

	  		if($validate->fails()){
	  			$data['errors'] = $validate->errors();
	  			return response()->json($data, $data['code']);
	  		}

	  		unset($params_array['id']);
	  		unset($params_array['user_id']);
	  		unset($params_array['game_id']);
	  		unset($params_array['category_id']);
	  		unset($params_array['created_at']);

	  		
	  		$user = $this->getIdentity($request);

	  		$topic = Topic::where('id', $id)
	  					  ->where('user_id', $user->sub)
	  					  ->first();

	  		if(!empty($topic) && is_object($topic)){
	  			$topic->update($params_array);
	  			$topic->updated_at = now();

	  			$data = array(
	  				'code' => 200,
	  				'status' => 'success',
	  				'topic' => $topic,
	  				'changes' => $params_array
	  			);
	  		}
	  	}
	  	return response()->json($data, $data['code']);
	  }

	  private function getIdentity($request){
		//Conseguir usuario identificado
		$jwtAuth = new JwtAuth();
		$token = $request->header('Authorization', null);
		$user = $jwtAuth->checkToken($token, true);

		return $user;
	}

	public function destroy($id, Request $request){
		$user = $this->getIdentity($request);

		$topic = Topic::where('id', $id)
					 ->where('user_id', $user->sub)
					 ->first();

		if(!empty($topic)){
			$topic->delete();

			$data = array(
				'code' => 200,
				'status' => 'success',
				'topic' => $topic
			);
		}else{
			$data = array(
				'code' => 400,
				'status' => 'error',
				'message' => 'El post no se ha podido eliminar o no existe'
			);
		}
		return response()->json($data, $data['code']);
	}

	public function upload(Request $request){
		$image = $request->file('file0');

		$validate = \Validator::make($request->all(), [
			'file0' => 'required|image|mimes:jpg, jpeg, png, gif'
		]);

		if(!$image || $validate->fails()){
			$data = [
				'code' => 400,
				'status' => 'error',
				'message' => 'Error'
			];
		}else{
			$image_name = time().$image->getClientOriginalName();

			\Storage::disk('topics')->put($image_name, \File::get($image));

			$data = [
				'code' => 200,
				'status' => 'success',
				'image' => $image_name
			];
		}

		return response()->json($data, $data['code']);
	}

	public function getImage($filename){
		$isset = \Storage::disk('topics')->exists($filename);

		if($isset){
			$file =\Storage::disk('topics')->get($filename);
		
			return new Response($file, 200);
		}else{
			$data = [
				'code' => 404,
				'status' => 'error',
				'message' => 'La imagen no existe'
			];
		}
		return response()->json($data, $data['code']);
	}

	public function getGamesTopics($category_id, $game_id = null){

		if(empty($game_id)){
			$cid=1;		//Contador de juegos
			$ct=1;		//Contador de topicos
			$game = [];
			$x=0;


			$game_c = Game::get()->last()->id;		//Juegos totales, cogido tomando como máximo eñ id más alto
			$topic_c = Topic::get()->last()->id;	//Tópicos totales

			while($cid<=$game_c){		//Recorremos todos los juegos
				while($ct<=$topic_c){	//Y recorremos los tópicos
					$topic_game = Topic::where('category_id', $category_id)
									   ->where('game_id', $cid)->count();		//Contamos cuantos topicos hay que tenga esa categoría y juego
					$ct++;
				}
				if($topic_game!=0){		//Si hay un solo tópico en el juego y categoría actual entonces lo añadimos a un array
					$game[$x] = Game::where('id', $cid)->get();
					$x++;
				}
				$cid++;
				$ct=0;
			}
			$game = array_values($game);
			$games = json_encode($game);
			$games = str_replace("[{", "{", $games);
			$games = str_replace("}]", "}", $games);
			$games = str_replace("[[", "[", $games);
			$games = str_replace("]]", "]", $games);
			$games = json_decode($games);

			if(!empty($games)){
				$data = [
					'code' => 200,
					'status' => 'success',
					'games' => $games
				];
			}else{
				$data = [
					'code' => 400,
					'status' => 'error',
					'message' => 'No hay juegos en esta categoría'
				];
			}
		}else{
			$topics = Topic::where('category_id', $category_id)
						   ->where('game_id', $game_id)->get();

			if(!empty($topics)){
				$data = [
						'code' => 200,
						'status' => 'success',
						'topics' => $topics
				];
			}else{
				$data = [
					'code' => 400,
					'status' => 'error',
					'message' => 'No hay posts para mostrar'
				];
			}

			
		}

		return response()->json($data, $data['code']);
	}


	public function search($busqueda){
	    $topics = Topic::where('title', 'LIKE', '%'.$busqueda.'%')
	             ->get();

	    if(!empty($topics)){
		    return response()->json([
		    	'code' => 200,
		        'status' => 'success',
		        'topics' => $topics
		    ]);
		}else{
			return response()->json([
		    	'code' => 400,
		        'status' => 'error',
		        'message' => 'La búsqueda no dio resultados'
		    ]);
		}
	}
}
