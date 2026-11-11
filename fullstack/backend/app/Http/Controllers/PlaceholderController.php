<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceholderController extends Controller
{
    public function __invoke(Request $request, string $page): JsonResponse
    {
        $today = new DateTime();
        $yesterday = (new DateTime())->modify('-1 day');
        $twoDaysAgo = (new DateTime())->modify('-2 days');

        $appointments =
        [
            ['id' => 1, 'customer' => 'Kiss Péter', 'plate' => 'ABC-123', 'service' => 'Olajcsere', 'date' => $today->format('Y-m-d'), 'status' => 'pending'],
            ['id' => 2, 'customer' => 'Nagy Anna', 'plate' => 'DEF-456', 'service' => 'Fékbetét', 'date' => $today->format('Y-m-d'), 'status' => 'approved'],
            ['id' => 3, 'customer' => 'Tóth Éva', 'plate' => 'JKL-012', 'service' => 'Futómű', 'date' => $yesterday->format('Y-m-d'), 'status' => 'progress'],
            ['id' => 4, 'customer' => 'Varga Lajos', 'plate' => 'MNO-345', 'service' => 'Klíma töltés', 'date' => $twoDaysAgo->format('Y-m-d'), 'status' => 'done'],
        ];

        $vehicles =
        [
            ['id' => 1, 'plate' => 'ABC-123', 'make' => 'Suzuki', 'model' => 'Swift', 'year' => 2018],
            ['id' => 2, 'plate' => 'DEF-456', 'make' => 'Skoda', 'model' => 'Octavia', 'year' => 2020],
        ];

        $services =
        [
            ['id' => 1, 'name' => 'Olajcsere', 'price' => 18000, 'duration_minutes' => 60],
            ['id' => 2, 'name' => 'Fékbetét csere', 'price' => 32000, 'duration_minutes' => 90],
            ['id' => 3, 'name' => 'Műszaki vizsga', 'price' => 25000, 'duration_minutes' => 120],
        ];

        $users =
        [
            ['id' => 1, 'name' => 'Kiss Péter', 'email' => 'peter@example.com', 'role' => 'customer'],
            ['id' => 2, 'name' => 'Szabó Gábor', 'email' => 'gabor@example.com', 'role' => 'worker'],
            ['id' => 3, 'name' => 'Admin Anna', 'email' => 'anna@example.com', 'role' => 'admin'],
        ];

        $data = match ($page)
        {
            'dashboard', 'admin.dashboard' =>
            [
                'summary' => ['today' => 2, 'pending' => 1, 'progress' => 1, 'done' => 1],
                'appointments' => $appointments,
            ],
            'vehicles' => $vehicles,
            'appointments', 'admin.appointments' => $appointments,
            'services', 'admin.services' => $services,
            'profile' => $users[0],
            'booking' => ['message' => 'Foglalás rögzítve (helyőrző).', 'received' => $request->all()],
            'admin.repairs', 'worker.repairs' =>
            [
                ['id' => 1, 'appointment_id' => 3, 'worker' => 'Szabó Gábor', 'status' => 'progress', 'note' => 'Alkatrészre vár'],
            ],
            'admin.users' => $users,
            'worker.jobs' => array_values(array_filter(
                $appointments,
                fn ($a) => in_array($a['status'], ['approved', 'progress'])
            )),
            default => [],
        };

        return response()->json([
            'page' => $page,
            'placeholder' => true,
            'data' => $data,
        ]);
    }
}

?>