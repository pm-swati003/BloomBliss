<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SetAdminUserSeeder extends Seeder
{
    /**
     * Create or assign an admin account.
     *
     * Option 1 - CREATE a new admin user (recommended):
     *   Add to .env:
     *   ADMIN_CREATE_EMAIL=admin@yourstore.com
     *   ADMIN_CREATE_NAME=Admin
     *   ADMIN_CREATE_PASSWORD=your_secure_password
     *   Then run: php artisan db:seed --class=SetAdminUserSeeder
     *
     * Option 2 - Make an EXISTING user admin:
     *   Add to .env: ADMIN_EMAIL=existinguser@email.com
     *   Then run: php artisan db:seed --class=SetAdminUserSeeder
     */
    public function run(): void
    {
        $createEmail = env('ADMIN_CREATE_EMAIL');
        $createName = env('ADMIN_CREATE_NAME', 'Admin');
        $createPassword = env('ADMIN_CREATE_PASSWORD');

        // Option 1: Create a new admin user (or set existing as admin)
        if ($createEmail && $createPassword) {
            $user = User::firstOrCreate(
                ['email' => trim(strtolower($createEmail))],
                [
                    'name' => trim($createName),
                    'password' => Hash::make($createPassword),
                    'is_admin' => true,
                    'role' => 'super_admin',
                ]
            );
            $user->update(['is_admin' => true, 'role' => 'super_admin']);
            if ($user->wasRecentlyCreated) {
                $this->command->info("Admin account created: {$user->email}. Log in with this email and your ADMIN_CREATE_PASSWORD.");
            } else {
                $this->command->info("User {$user->email} is now an admin.");
            }
            return;
        }

        // Option 2: Set existing user as admin by email
        $email = env('ADMIN_EMAIL');
        if ($email) {
            $user = User::where('email', trim(strtolower($email)))->first();
            if ($user) {
                $user->update(['is_admin' => true]);
                $this->command->info("User {$user->email} set as admin.");
                return;
            }
            $this->command->warn("No user found with email: {$email}");
        }

        $this->command->line('');
        $this->command->warn('To create an admin account, add to your .env file:');
        $this->command->line('  ADMIN_CREATE_EMAIL=admin@yourstore.com');
        $this->command->line('  ADMIN_CREATE_NAME=Admin');
        $this->command->line('  ADMIN_CREATE_PASSWORD=your_secure_password');
        $this->command->line('Then run: php artisan db:seed --class=SetAdminUserSeeder');
        $this->command->line('');
        $this->command->warn('Or to make an existing user admin, add: ADMIN_EMAIL=thatuser@email.com');
    }
}
