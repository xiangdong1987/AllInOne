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

    /**
     * 登陆
     *
     * @return \App\type
     */
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

    /**
     * 添加章节
     *
     * @return \App\type
     */
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

    /**
     * 添加文章
     *
     * @return \App\type
     */
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

    /**
     * 获取文章
     *
     * @return \App\type
     * @throws \Exception
     */
    function getArticle()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $page = $request['page'] ? $request : 1;
        $where["order"] = 'id';
        $where["page"] = $page;
        $Article = model('Article');
        $pageStat=[];
        $flag = $Article->gets($where,$pageStat);
        if ($flag) {
            $result['data']=$flag;
            $result['page']=handlePage((array)$pageStat);
            return $this->returnSucess($result);
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    /**
     * 根据ID 获取文章
     *
     * @return \App\type
     */
    function getArticleById()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['id'];
        $chapter = model('Article');
        $data = $chapter->get($id, "id")->get();
        return $this->returnSucess($data);
    }

    /**
     * 保存文章
     *
     * @return \App\type
     */
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

    /**
     * 获取章节
     *
     * @return \App\type
     * @throws \Exception
     */
    function getChapter()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $where["order"] = 'id';
        $Chapter = model('Chapter');
        $flag = $Chapter->gets($where);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    /**
     * 根据ID 获取章节
     *
     * @return \App\type
     */
    function getChapterById()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['id'];
        $chapter = model('Chapter');
        $data = $chapter->get($id, "id")->get();
        return $this->returnSucess($data);
    }

    /**
     * 保存章节
     *
     * @return \App\type
     */
    function saveChapter()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['id'];
        $data["chapter_name"] = $request["chapter_name"];
        $data["status"] = $request["status"];
        $data["pid"] = $request["pid"];
        $data["rank"] = $request["rank"];
        $chapter = model('Chapter');
        $flag = $chapter->set($id, $data);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("修改失败");
        }
    }

    /**
     * 获取主页信息
     *
     * @return \App\type
     */
    function getHomePage()
    {
        $chapter = model('Article');
        $data = $chapter->get('1', "id")->get();
        return $this->returnSucess($data);
    }

    /**
     * 获取菜单
     *
     * @return mixed
     * @throws \Exception
     */
    function getMenu()
    {
        $where["order"] = 'id';
        $Chapter = model('Chapter');
        $article = model('Article');
        //获取一级菜单
        $first['where'] = [
            "pid = 0",
            "status =  1"
        ];
        $result_1 = $Chapter->gets($first);
        //获取二级菜单
        foreach ($result_1 as $one) {
            $last[$one['id']]['name'] = $one['chapter_name'];
            $second['where'] = [
                "pid = " . $one['id'],
                "status =  1"
            ];
            $list = $Chapter->gets($second);
            if ($list) {
                foreach ($list as $tow) {
                    $last[$one['id']]['list'][$tow['id']]['name'] = $tow['chapter_name'];
                    $third['where'] = 'chapter_id = ' . $tow['id'];
                    $listArticle = $article->gets($third);
                    if ($listArticle) {
                        foreach ($listArticle as $three) {
                            $last[$one['id']]['list'][$tow['id']]['list'][$three['id']]["name"] = $three['title'];
                            $last[$one['id']]['list'][$tow['id']]['list'][$three['id']]["id"] = $three['id'];
                            $last[$one['id']]['list'][$tow['id']]['list'][$three['id']]["list"] = [];
                        }
                    } else {
                        $last[$one['id']]['list'][$tow['id']]['list'] = [];
                    }
                }
            } else {
                $last[$one['id']]['list'] = [];
            }

        }
        return $this->returnSucess($last);
    }
}