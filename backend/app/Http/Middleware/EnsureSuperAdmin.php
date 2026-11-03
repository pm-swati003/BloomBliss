<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Forbidden. Super admin only.'], 403);
        }

        // Explicit super_admin always has access
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Fallback: if no super_admin exists in the system, allow the first admin to manage staff
        // (e.g. when the only admin was created via seeder before role was set to super_admin)
        if ($user->is_admin && ! User::where('role', 'super_admin')->exists()) {
            return $next($request);
        }

        return response()->json(['error' => 'Forbidden. Super admin only.'], 403);
    }
}
