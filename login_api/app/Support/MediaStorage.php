<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorage
{
    public static function store(UploadedFile $file, string $directory): string
    {
        $disk = config('media.disk', 'uploads');
        $filename = self::buildFilename($file);
        $path = trim($directory, '/') . '/' . $filename;

        Storage::disk($disk)->putFileAs(
            trim($directory, '/'),
            $file,
            $filename,
            ['visibility' => 'public']
        );

        if ($disk === 'uploads') {
            return '/uploads/' . ltrim($path, '/');
        }

        return Storage::disk($disk)->url($path);
    }

    private static function buildFilename(UploadedFile $file): string
    {
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        return now()->format('YmdHis') . '-' . Str::random(8) . '-' . Str::slug($name) . '.' . $extension;
    }
}
