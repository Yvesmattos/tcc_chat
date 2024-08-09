<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class DashboardController extends Controller
{
    public function index()
    {
        $openTickets = Ticket::where('status', 'open')->get();
        $closedTickets = Ticket::where('status', 'closed')->get();
        
        return view('dashboard', compact('openTickets', 'closedTickets'));
    }
}
