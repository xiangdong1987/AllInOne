<?php
/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/1
 * Time: 下午2:16
 */
//创建Server对象，监听 127.0.0.1:9502端口，类型为SWOOLE_SOCK_UDP
$server = new swoole_server("127.0.0.1", 9502, SWOOLE_PROCESS, SWOOLE_SOCK_UDP);

//监听数据发送事件
$server->on('Packet', function ($server, $data, $clientInfo) {
    $server->sendto($clientInfo['address'], $clientInfo['port'], "Server " . $data);
    var_dump($clientInfo);
});
//启动服务器
$server->start();