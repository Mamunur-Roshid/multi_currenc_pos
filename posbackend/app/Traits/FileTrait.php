<?php

namespace App\Traits;

use Illuminate\Support\Facades\File;
use stdClass;

trait FileTrait {
    public function trimSlash($str) {
        $trim = trim($str, '/');
        if ($trim) {
            $trim .= '/';
        }
        return $trim;
    }
    public function uploadFile($file, $opt = []) {
        $res = new stdClass;
        $res->status = false;
        $res->message = '';

        $options = new stdClass;
        $options->dir = isset($opt['dir']) ? $opt['dir'] : '';

        $base_path = 'upload/'.date('Y-m').'/'.$this->trimSlash($options->dir);

        if (! is_dir($base_path)) {
            File::makeDirectory($base_path);
        }

        $file_name = time().rand(100, 999).$file->getClientOriginExtension();
        try {
            $file->move($base_path, $file_name);
            $res->path = $base_path.$file_name;
            $res->status = true;
        } catch (\Throwable $th) {}
        return $res;
    }

    public function deleteFile($path) {
        File::delete($path);
    }


}
