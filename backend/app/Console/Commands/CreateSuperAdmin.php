<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create-super-admin
                            {--email= : Admin email}
                            {--password= : Admin password (min 8 chars)}';

    protected $description = 'Create the one and only super admin account (run once per environment). No .env needed.';

    public function handle(): int
    {
        if (User::where('role', 'super_admin')->exists()) {
            $this->error('A super admin already exists. Only one super admin is allowed.');
            return self::FAILURE;
        }

        $email = $this->option('email') ?: $this->ask('Super admin email');
        $password = $this->option('password') ?: $this->secret('Super admin password (min 8 characters)');

        if (!$email || !$password) {
            $this->error('Email and password are required.');
            return self::FAILURE;
        }

        $validator = Validator::make(
            ['email' => $email, 'password' => $password],
            [
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $msg) {
                $this->error($msg);
            }
            return self::FAILURE;
        }

        User::create([
            'name' => 'Super Admin',
            'email' => trim(strtolower($email)),
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'is_admin' => true,
        ]);

        $this->info('Super admin created successfully.');
        $this->line('Log in with: ' . $email);
        return self::SUCCESS;
    }
}
