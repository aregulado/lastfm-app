<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ArtistRepositoryInterface;
use Illuminate\Http\JsonResponse;

class ArtistController extends Controller
{
    protected $artistRepository;

    public function __construct(ArtistRepositoryInterface $artistRepository)
    {
        $this->artistRepository = $artistRepository;
    }

    public function index(): JsonResponse
    {
        $artists = $this->artistRepository->all();

        return response()->json([
            'success' => true,
            'data' => $artists,
        ]);
    }
}