<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $indexFile = public_path('index.html');

    if (file_exists($indexFile)) {
        return response()->file($indexFile);
    }

    abort(404);
})->where('any', '^(?!api|storage|up).*$');
