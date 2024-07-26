<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $ticket = new Ticket();
        $ticket->title = $request->input('title');
        $ticket->description = $request->input('description');
        $ticket->status = 'open'; // Definindo o status inicial como 'open'
        $ticket->save();

        return redirect()->route('dashboard')->with('success', 'Ticket criado com sucesso!');
    }

    public function close($id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->status = 'closed';
        $ticket->save();

        return redirect()->route('dashboard')->with('success', 'Ticket fechado com sucesso!');
    }
}
