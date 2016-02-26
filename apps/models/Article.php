<?php
namespace App\Model;
use Swoole;

class Article extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'article';
}