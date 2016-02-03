<?php
namespace App\Controller;

use App\BasicController;
use Swoole;

class Api extends BasicController
{
    function __construct(\Swoole $swoole)
    {
        parent::__construct($swoole);
        $this->is_ajax=true;
    }
    function login()
    {
        $auto_login=false;
        $this->session->start();
        $postData = file_get_contents("php://input");
        $request = json_decode($postData,1);
        if($request['RememberMe']){
            $auto_login=true;
        }
        $r = $this->user->login(trim($request['UserName']), $request['Password'],$auto_login);
        if ($r) {
            return $this->returnSucess("登陆成功");
        } else {
            return $this->returnFailure("登陆失败");
        }
    }

}