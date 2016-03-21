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
        $pageStat = [];
        $flag = $Article->gets($where, $pageStat);
        if ($flag) {
            $result['data'] = $flag;
            $result['page'] = handlePage((array)$pageStat);
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
     * 保存商品
     *
     * @return \App\type
     */
    function addGood()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $data["name"] = $request["name"];
        $data["sale_price"] = $request["sale_price"];
        $data["price"] = $request["price"];
        $data["cate_id"] = $request["cate_id"];
        $data["des"] = $request["des"];
        $data["img"] = $request["img"];
        $data["video"] = $request["video"];
        $chapter = model('Good');
        $flag = $chapter->put($data);
        if ($flag) {
            return $this->returnSucess("插入成功");
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    /**
     * 根据ID 获取商品
     *
     * @return \App\type
     */
    function getGoodById()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['good_id'];
        $chapter = model('Good');
        $data = $chapter->get($id, "good_id")->get();
        return $this->returnSucess($data);
    }

    /**
     * 获取商品列表
     *
     * @return \App\type
     */
    function getGood()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $cate_id = $request['cate_id'];
        $is_recommend = $request['is_recommend'];
        $is_font = $request['is_font'];
        $where["order"] = 'good_id';
        if ($cate_id) {
            $where["where"][] = "cate_id = $cate_id";
        }
        if ($is_recommend) {
            $where["where"][] = "is_recommend = $is_recommend";
        }
        $Chapter = model('Good');
        if ($is_font) {
            $Chapter->select = 'good_id,name,sale_price,cate_id,des,img,video,is_recommend';
        }
        $flag = $Chapter->gets($where);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    /**
     * 保存商品
     *
     * @return \App\type
     */
    function saveGood()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['good_id'];
        $data["name"] = $request["name"];
        $data["sale_price"] = $request["sale_price"];
        $data["price"] = $request["price"];
        $data["cate_id"] = $request["cate_id"];
        $data["des"] = $request["des"];
        $data["img"] = $request["img"];
        $data["video"] = $request["video"];
        $data["is_recommend"] = $request["is_recommend"];
        $chapter = model('Good');
        $flag = $chapter->set($id, $data);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("修改失败");
        }
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

    /**
     * 添加商品分类
     *
     * @return \App\type
     */
    function addCategory()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $data["cate_name"] = $request["cate_name"];
        $data["rank"] = $request["rank"];
        $chapter = model('Category');
        $flag = $chapter->put($data);
        if ($flag) {
            return $this->returnSucess("插入成功");
        } else {
            return $this->returnFailure("插入失败");
        }
    }

    function getCategory()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $where["order"] = 'rank';
        $Chapter = model('Category');
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
    function getCategoryById()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['cate_id'];
        $chapter = model('Category');
        $data = $chapter->get($id, "cate_id")->get();
        return $this->returnSucess($data);
    }

    /**
     * 保存章节
     *
     * @return \App\type
     */
    function saveCategory()
    {
        $postData = file_get_contents("php://input");
        $request = json_decode($postData, 1);
        $id = $request['cate_id'];
        $data["cate_name"] = $request["cate_name"];
        $data["rank"] = $request["rank"];
        $chapter = model('Category');
        $flag = $chapter->set($id, $data);
        if ($flag) {
            return $this->returnSucess($flag);
        } else {
            return $this->returnFailure("修改失败");
        }
    }

    /**
     * 图片上传
     * @return \App\type
     */
    function uploadFile()
    {
        $path="/data/www/AllInOne/video/";
        $domain="http://www.showbig.com.cn/video/";
        if ($_FILES["file"]["type"] == "video/mp4") {
            if ($_FILES["file"]["error"] > 0) {
                $message="Return Code: " . $_FILES["file"]["error"] . "<br />";
                return $this->returnFailure($message);
            } else {
                if (file_exists($path . $_FILES["file"]["name"])) {
                    $message=$_FILES["file"]["name"] . " already exists. ";
                    return $this->returnFailure($message);
                } else {
                    $flag=move_uploaded_file($_FILES["file"]["tmp_name"], $path. $_FILES["file"]["name"]);
                    return $this->returnSucess($domain.$_FILES["file"]["name"]);
                }
            }
        } else {
            $message="Invalid file";
            return $this->returnFailure($message);
        }
    }
}