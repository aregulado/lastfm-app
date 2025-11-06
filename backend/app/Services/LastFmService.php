<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LastFmService
{
    protected $apiKey;
    protected $baseUrl = 'https://ws.audioscrobbler.com/2.0/';

    public function __construct()
    {
        $this->apiKey = config('services.lastfm.api_key');
    }

    public function getTopArtists($limit = 50)
    {
        try {
            $response = Http::get($this->baseUrl, [
                'method' => 'chart.gettopartists',
                'api_key' => $this->apiKey,
                'format' => 'json',
                'limit' => $limit,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['artists']['artist'] ?? [];
            }

            Log::error('Last.fm API error', ['response' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('Last.fm API exception', ['message' => $e->getMessage()]);
            return [];
        }
    }

    public function formatArtistData(array $artist)
    {
        return [
            'name' => $artist['name'] ?? '',
            'listeners' => (int) ($artist['listeners'] ?? 0),
            'url' => $artist['url'] ?? '',
            'image' => $this->getArtistImage($artist),
        ];
    }

    protected function getArtistImage(array $artist)
    {
        if (!isset($artist['image']) || !is_array($artist['image'])) {
            return null;
        }

        foreach (array_reverse($artist['image']) as $image) {
            if (!empty($image['#text'])) {
                return $image['#text'];
            }
        }

        return null;
    }
}
