<?php
/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/4
 * Time: 下午5:13
 */
$server = new swoole_server("0.0.0.0", 9501);
$server->set(array(
    'worker_num' => 2,
    'task_worker_num' => 2,
));
$server->on('pipeMessage', function ($server, $src_worker_id, $data) {
    echo "#{$server->worker_id} message from #$src_worker_id: $data\n";
});
$server->on('task', function ($server, $task_id, $from_id, $data) {
    var_dump($task_id, $from_id, $data);
});
$server->on('finish', function ($server, $fd, $from_id) {

});
$server->on('receive', function (swoole_server $server, $fd, $from_id, $data) {
    if (trim($data) == 'task') {
        $server->task("async task coming");
    } else {
        $worker_id = 1 - $server->worker_id;
        $server->sendMessage("hello task process", $worker_id);
    }
});

$server->start();


$server = new swoole_server('127.0.0.1', 9501);
$process = new swoole_process(function($process) use ($server) {
    while (true) {
        $msg = $process->read();
        foreach($server->connections as $conn) {
            $server->send($conn, $msg);
        }
    }
});
$server->addProcess($process);
$server->on('receive', function ($serv, $fd, $from_id, $data) use ($process) {
    //群发收到的消息
    $process->write($data);
});
$server->start();

