<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\MediaStorage;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function uploadChatImage(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $path = MediaStorage::store($validated['image'], 'chat-attachments');

        return response()->json([
            'success' => true,
            'message' => 'Chat image uploaded successfully.',
            'path' => $path,
            'url' => $path,
        ]);
    }
}
