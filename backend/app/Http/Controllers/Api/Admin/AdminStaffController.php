<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminStaffController extends Controller
{
    /** Create a new staff member (admin or shop_keeper) – super_admin only */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,shop_keeper,delivery',
        ]);

        $user = User::create([
            'name' => trim($request->name),
            'email' => trim(strtolower($request->email)),
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_admin' => in_array($request->role, ['super_admin', 'admin', 'shop_keeper'], true),
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_admin' => $user->is_admin,
            'created_at' => $user->created_at?->toIso8601String(),
        ], 201);
    }

    /** List all staff (super_admin, admin, shop_keeper). Added staff appear here without re-registering. */
    public function index(Request $request)
    {
        $query = User::select(['id', 'name', 'email', 'role', 'is_admin', 'created_at'])
            ->whereIn('role', ['super_admin', 'admin', 'shop_keeper', 'delivery']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }

        $driver = DB::connection()->getDriverName();
        if ($driver === 'mysql' || $driver === 'mariadb') {
            $query->orderByRaw("FIELD(role, 'super_admin', 'admin', 'shop_keeper', 'delivery')");
        } else {
            $query->orderByRaw("CASE role WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2 WHEN 'shop_keeper' THEN 3 WHEN 'delivery' THEN 4 ELSE 5 END");
        }
        $query->orderBy('name');
        $perPage = (int) $request->get('per_page', 20);
        $users = $query->paginate($perPage);

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'customer',
                'is_admin' => $user->is_admin,
                'created_at' => $user->created_at?->toIso8601String(),
            ];
        });

        return response()->json($users);
    }

    /** Update a user's role – super_admin only. Cannot set super_admin via API. */
    public function updateRole(Request $request, int $id)
    {
        $request->validate([
            'role' => 'required|in:admin,shop_keeper,delivery,customer',
        ]);
        $user = User::findOrFail($id);
        $me = $request->user();
        if ($user->id === $me->id && $user->isSuperAdmin()) {
            return response()->json(['error' => 'You cannot change your own super admin role.'], 403);
        }
        if ($user->isSuperAdmin() && !$me->isSuperAdmin()) {
            return response()->json(['error' => 'Cannot change super admin.'], 403);
        }
        $user->update([
            'role' => $request->role,
            'is_admin' => in_array($request->role, ['super_admin', 'admin', 'shop_keeper'], true),
        ]);
        return response()->json([
            'id' => $user->id,
            'role' => $user->role,
            'is_admin' => $user->is_admin,
        ]);
    }

    /** Get config: assignable roles and permissions (for UI) */
    public function config()
    {
        return response()->json([
            'roles' => config('admin.roles'),
            'assignable_roles' => array_intersect_key(
                config('admin.roles'),
                array_flip(User::assignableRoles())
            ),
            'permissions' => config('admin.permissions'),
            'role_permissions' => config('admin.role_permissions'),
        ]);
    }
}
