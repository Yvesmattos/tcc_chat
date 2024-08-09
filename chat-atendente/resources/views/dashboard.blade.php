@extends('layouts.app')

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
</div>

@if (session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

<div class="row">
    <div class="col-md-6 mb-3">
        <div class="card">
            <div class="card-header">
                <h2>Tickets Abertos</h2>
            </div>
            <div class="card-body">
                <ul class="list-group">
                    {{-- Loop pelos tickets abertos --}}
                    @foreach ($openTickets as $ticket)
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{{ $ticket->title }}</h5>
                                <p>{{ $ticket->description }}</p>
                            </div>
                            <form method="POST" action="{{ route('tickets.close', $ticket->id) }}">
                                @csrf
                                <button type="submit" class="btn btn-danger btn-sm">Fechar</button>
                            </form>
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-6 mb-3">
        <div class="card">
            <div class="card-header">
                <h2>Tickets Resolvidos</h2>
            </div>
            <div class="card-body">
                <ul class="list-group">
                    {{-- Loop pelos tickets resolvidos --}}
                    @foreach ($closedTickets as $ticket)
                        <li class="list-group-item">
                            <h5>{{ $ticket->title }}</h5>
                            <p>{{ $ticket->description }}</p>
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="card mt-5">
    <div class="card-header">
        <h2>Criar Novo Ticket</h2>
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('tickets.store') }}">
            @csrf
            <div class="form-group">
                <label for="title">Título</label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="form-group">
                <label for="description">Descrição</label>
                <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Criar Ticket</button>
        </form>
    </div>
</div>
@endsection
