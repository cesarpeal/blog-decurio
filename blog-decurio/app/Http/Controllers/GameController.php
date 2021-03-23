<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Helpers\JwtAuth;
use App\Game;

class GameController extends Controller
{
	public function index(){
    	$games = Game::all();
    
	    	return response()->json([
		    	'code' => 200,
		    	'status' => 'success',
		    	'games' => $games
	    	]);
	    }

	public function show($id){
		$game = Game::where('id', $id)
			 ->first();

		return response()->json([
		    	'code' => 200,
		    	'status' => 'success',
		    	'game' => $game
	    	]);
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
	  			'name' => 'required',
	  			'image' => 'required'
	  		]);

	  		if($validate->fails()){
	  			$data = [
	  				'code' => 400,
	  				'status' => 'error',
	  				'message' => 'Faltan datos'
	  			];
	  		}else{
	  			//Guardar el artículo
	  			$game = new Game();
	  			$game->user_id = $user->sub;
	  			$game->name = $params->name;
	  			$game->image = $params->image;
	  			$game->save();

	  			$data = [
		  			'code' => 200,
		  			'status' => 'success',
		  			'topic' => $game
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


	  private function getIdentity($request){
		//Conseguir usuario identificado
		$jwtAuth = new JwtAuth();
		$token = $request->header('Authorization', null);
		$user = $jwtAuth->checkToken($token, true);

		return $user;
	}

	public function destroy($id, Request $request){
		$user = $this->getIdentity($request);

		$game = Game::where('id', $id)
					 ->where('user_id', $user->sub)
					 ->first();

		if(!empty($game)){
			$game->delete();

			$data = array(
				'code' => 200,
				'status' => 'success',
				'game' => $game
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

			\Storage::disk('games')->put($image_name, \File::get($image));

			$data = [
				'code' => 200,
				'status' => 'success',
				'image' => $image_name
			];
		}

		return response()->json($data, $data['code']);
	}

	public function getImage($filename){
		$isset = \Storage::disk('games')->exists($filename);

		if($isset){
			$file =\Storage::disk('games')->get($filename);
		
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
}
