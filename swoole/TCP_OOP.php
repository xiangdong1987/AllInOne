<?php

/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/1
 * Time: 下午2:02
 */
class TCP
{
    public $server;

    public function TCP($ip, $port)
    {
        if ($this->server) {
            return $this->server;
        } else {
            $this->server = new swoole_server($ip, $port);
            return $this->server;
        }
    }

    public function run()
    {
        $this->server->on('connect', array($this, 'connect'));
        $this->server->on('receive', array($this, 'receive'));
        $this->server->on('close', array($this, 'close'));
        $this->server->start();
    }

    public function connect($serv, $fd)
    {
        echo "Client: Connect.\n";
    }

    public function receive($serv, $fd, $from_id, $data)
    {
        $this->server->send($fd, "Server: " . $data);
    }

    public function close($serv, $fd)
    {
        echo "Client: Close.\n";
    }
}

$server = new TCP('127.0.0.1', 9501);
$server->run();