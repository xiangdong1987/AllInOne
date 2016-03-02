<?php
/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/1
 * Time: 下午5:23
 */
$client = new swoole_client(SWOOLE_SOCK_TCP);
//连接到服务器
if (!$client->connect('127.0.0.1', 9501, 0.5))
{
    die("connect failed.");
}
//向服务器发送数据
if (!$client->send("hello world"))
{
    die("send failed.");
}
//从服务器接收数据
$data = $client->recv();
if (!$data)
{
    die("recv failed.");
}
echo $data;
//关闭连接
$client->close();

$client = new swoole_client(SWOOLE_SOCK_TCP, SWOOLE_SOCK_ASYNC);
//注册连接成功回调
$client->on("connect", function ($cli) {
    $cli->send("hello world\n");
});
//注册数据接收回调
$client->on("receive", function ($cli, $data) {
    echo "Received: " . $data . "\n";
});
//注册连接失败回调
$client->on("error", function ($cli) {
    echo "Connect failed\n";
});
//注册连接关闭回调
$client->on("close", function ($cli) {
    echo "Connection close\n";
});
//发起连接
$client->connect('127.0.0.1', 9501, 0.5);