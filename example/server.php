<?php
header('Access-Control-Allow-Origin:*');
ini_set('yar.packager','json');
if(!class_exists('Yar_Server',false)){
    exit('Error:Yar not Found。');
}

class YarHandle
{

    public function test($arg1,$arg2){
        return array(
            $arg1,$arg2
        );
    }
}

$server = new Yar_Server(new YarHandle());
$server->handle();
