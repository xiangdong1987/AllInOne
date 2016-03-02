<?php
/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/1
 * Time: 下午2:01
 */
$server = new swoole_server("127.0.0.1", 9501);
$server->on('connect', function ($server, $fd) {
    echo "Client: Connect.\n";
});
$server->on('receive', function ($server, $fd, $from_id, $data) {
    $server->send($fd, "Server: " . $data);
});
$server->on('close', function ($server, $fd) {
    echo "Client: Close.\n";
});
$server->start();