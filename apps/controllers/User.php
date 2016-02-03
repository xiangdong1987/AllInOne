<?php
namespace App\Controller;

use Swoole;

class User extends Swoole\Controller
{
    function __construct(\Swoole $swoole)
    {
        parent::__construct($swoole);
        $this->is_ajax=true;
    }

    function login()
    {
        $auto_login=false;
        //使用crypt密码
        Swoole\Auth::$password_hash = Swoole\Auth::HASH_SHA1;

        $this->session->start();
        //已经登录了，跳转到
        if ($this->user->isLogin()) {
            $this->http->redirect('/user/home/');
            return;
        }
        if (!empty($_POST['password'])) {
            if($_POST['rememberMe']=="on"){
                $auto_login=true;
            }
            $r = $this->user->login(trim($_POST['username']), $_POST['password'],$auto_login);
            if ($r) {
                $this->http->redirect('/user/home/');
                return;
            } else {
                echo "登录失败";
            }
        } else {
            $this->display('user/login.php');
        }
    }

    function home()
    {
        $this->session->start();
        Swoole\Auth::loginRequire();
        $this->display('user/home.php');
    }

    function logout()
    {
        $this->session->start();
        $this->user->logout();
        $this->http->redirect('/user/home/');
    }
}