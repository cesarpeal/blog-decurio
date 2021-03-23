<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{

    public function register(Request $request){

    	//Recoger los datos del usuario por post
    	$json = $request->input('json', null);
    	$params = json_decode($json); //objeto
        $params_array = json_decode($json, true); //array

        if(!empty($params && $params_array)){

            //Limpiar los datos
            $params_array = array_map('trim', $params_array);

        	//Validar datos
            $validate = \Validator::make($params_array,[
                'nickname' => 'required|alpha',
                'email' => 'required|email|unique:users',
                'password' => 'required'
            ]);

            if($validate->fails()){
                //Validación fallada
                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado',
                    'errors' =>$validate->errors()
                );
            }else{
                //Validación pasada correctamente
                //Cifrar la contraseña
                $pwd = hash('sha256', $params->password);


                //Comprobar que el usuario no exista
                $user = new User();
                $user->nickname = $params_array['nickname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->rol = 'usuario';

                //Guardar el usuario
                $user->save(); //Esto básicamente hace un insert en la bbdd

                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha creado correctamente',
                    'user' => $user
                );
            }

        }else{
            $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'Los datos enviados no son correctos'
                );
        }

    	return response()->json($data, $data['code']);
    }

    public function login(Request $request){
        $jwtAuth = new \JwtAuth();

        // Recibir datos por POST
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        // Validar esos datos
        $validate = \Validator::make($params_array,[
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if($validate->fails()){
            //Validación fallada
            $signup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'Fallo al loguearse',
                'errors' =>$validate->errors()
            );
        }else{
            // Cifrar la password
            $pwd = hash('sha256', $params->password);

            // Devolver token o datos
            $signup = $jwtAuth->signup($params->email, $pwd);
            if(!empty($params->getToken)){
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }

        return response()->json($signup, 200);
    }

    public function update(Request $request){
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        if($checkToken){
            echo "<h1>Login correcto</h1>";
        }else{
            echo "<h1>Login incorrecto</h1>";
        }
    }
}
