<?php
namespace App\Model;
use Swoole;

class Good extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'good';
    public $primary='good_id';
}