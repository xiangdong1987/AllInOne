<?php
namespace App\Controller;

use App\BasicController;
use Swoole;

class Api extends BasicController
{
    function __construct(\Swoole $swoole)
    {
        parent::__construct($swoole);
        $this->is_ajax = true;
    }

    function login()
    {
        $auto_login = false;
        $this->session->start();
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        if ($request['RememberMe']) {
            $auto_login = true;
        }
        $r = $this->user->login(trim($request['UserName']), $request['Password'], $auto_login);
        if ($r) {
            return $this->returnSucess("登陆成功");
        } else {
            return $this->returnFailure("登陆失败");
        }
    }

    function addChapter()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $data["chapter_name"] = $request["chapter_name"];
        $data["status"] = $request["status"];
        $data["pid"] = $request["pid"];
        $data["rank"] = $request["rank"];
        $chapter = model('Chapter');
        $flag = $chapter->put($data);
        if ($flag) {
            return $this->returnSucess("插入成功");
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    function addArticle()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $data["chapter_id"] = $request["chapter_id"];
        $data["title"] = $request["title"];
        $data["content"] = $request["content"];
        $data["ctime"] = date('Y-m-d H:i:s', time());
        $chapter = model('Article');
        $flag = $chapter->put($data);
        if ($flag) {
            return $this->returnSucess("插入成功");
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    function getArticle()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $where["order"] = 'id';
        $Article = model('Article');
        $flag = $Article->gets($where);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    function getArticleById()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['id'];
        $chapter = model('Article');
        $data = $chapter->get($id, "id")->get();
        return $this->returnSucess($data);
    }

    function saveArticle()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['id'];
        $data["chapter_id"] = $request["chapter_id"];
        $data["title"] = $request["title"];
        $data["content"] = $request["content"];
        $data["ctime"] = date('Y-m-d H:i:s', time());
        $chapter = model('Article');
        $flag = $chapter->set($id, $data);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("修改失败");
        }
    }

    function getHomePage()
    {
        $chapter = model('Article');
        $data = $chapter->get('1', "id")->get();
        return $this->returnSucess($data);
    }

}