<?php

namespace App\Support\Zego;

use InvalidArgumentException;

class ZegoTokenService
{
    public static function generateToken04(
        int $appId,
        string $userId,
        string $secret,
        int $effectiveTimeInSeconds,
        string $payload = ''
    ): string {
        if ($appId <= 0) {
            throw new InvalidArgumentException('ZEGO app ID is invalid.');
        }

        if ($userId === '') {
            throw new InvalidArgumentException('ZEGO user ID is required.');
        }

        if (strlen($secret) !== 32) {
            throw new InvalidArgumentException('ZEGO server secret must be a 32 byte string.');
        }

        if ($effectiveTimeInSeconds <= 0) {
            throw new InvalidArgumentException('ZEGO token TTL must be greater than zero.');
        }

        $timestamp = time();
        // ZEGO token04 expects nonce to fit a signed 32-bit integer.
        $nonce = random_int(1, 2147483647);
        $data = [
            'app_id' => $appId,
            'user_id' => $userId,
            'nonce' => $nonce,
            'ctime' => $timestamp,
            'expire' => $timestamp + $effectiveTimeInSeconds,
            'payload' => $payload,
        ];

        $cipher = 'aes-256-cbc';
        $iv = self::makeRandomIv();
        $plaintext = json_encode($data, JSON_BIGINT_AS_STRING | JSON_UNESCAPED_SLASHES);
        $encrypted = openssl_encrypt($plaintext, $cipher, $secret, OPENSSL_RAW_DATA, $iv);

        if ($encrypted === false) {
            throw new InvalidArgumentException('Failed to encrypt ZEGO token payload.');
        }

        $binary = pack('J', $data['expire']);
        $binary .= pack('na*na*', strlen($iv), $iv, strlen($encrypted), $encrypted);

        return '04' . base64_encode($binary);
    }

    private static function makeRandomIv(int $length = 16): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $maxIndex = strlen($characters) - 1;
        $result = '';

        for ($index = 0; $index < $length; $index += 1) {
            $result .= $characters[random_int(0, $maxIndex)];
        }

        return $result;
    }
}
