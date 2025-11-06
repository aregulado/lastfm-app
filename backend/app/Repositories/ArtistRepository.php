<?php

namespace App\Repositories;

use App\Models\Artist;
use App\Repositories\Interfaces\ArtistRepositoryInterface;

class ArtistRepository implements ArtistRepositoryInterface
{
    protected $model;

    public function __construct(Artist $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->orderBy('listeners', 'desc')->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $artist = $this->model->findOrFail($id);
        $artist->update($data);
        return $artist;
    }

    public function delete(int $id)
    {
        return $this->model->findOrFail($id)->delete();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function truncate()
    {
        return $this->model->truncate();
    }
}
