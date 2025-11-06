<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\LastFmService;
use App\Repositories\Interfaces\ArtistRepositoryInterface;

class ImportLastFmArtists extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lastfm:import {--limit=50 : Number of artists to import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import top artists from Last.fm API';

    /**
     * Last.fm service instance.
     *
     * @var LastFmService
     */
    protected $lastFmService;

    /**
     * Artist repository instance.
     *
     * @var ArtistRepositoryInterface
     */
    protected $artistRepository;

    /**
     * Create a new command instance.
     */
    public function __construct(LastFmService $lastFmService, ArtistRepositoryInterface $artistRepository)
    {
        parent::__construct();

        $this->lastFmService = $lastFmService;
        $this->artistRepository = $artistRepository;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limit = (int) $this->option('limit');

        $this->info("Fetching top {$limit} artists from Last.fm...");

        $artists = $this->lastFmService->getTopArtists($limit);

        if (empty($artists)) {
            $this->error('No artists found or API error occurred.');
            return 1;
        }

        $this->info('Clearing existing artists...');
        // Expect repository has a truncate method; if not, replace with appropriate clear method.
        $this->artistRepository->truncate();

        $this->info('Importing artists...');
        $bar = $this->output->createProgressBar(count($artists));
        $bar->start();

        foreach ($artists as $artistData) {
            $formattedData = $this->lastFmService->formatArtistData($artistData);
            $this->artistRepository->create($formattedData);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Artists imported successfully!');

        return 0;
    }
}