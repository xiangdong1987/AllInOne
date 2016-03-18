<?php
namespace App\Model;
use Swoole;

class Category extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'category';
    public $primary='cate_id';
}