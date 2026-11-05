<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // USERS
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');  // Assuming you will hash the password before storing it, don't know how to yet
            $table->string('role')->default('customer');
            $table->string('phone')->unique();
            $table->rememberToken();
            $table->timestamps();
        });

        // VEHICLES 
        // USERS -> VEHICLES
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->string('brand');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->string('license_plate')->unique();
            $table->timestamps();
        });

        // EMPLOYEES
        // USERS -> EMPLOYEES
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->string('specialization')->nullable();
            $table->timestamps();
        });

        // SERVICES
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('min_duration');
            $table->unsignedInteger('max_duration');
            $table->timestamps();
        });

        // APPOINTMENTS
        // USERS -> APPOINTMENTS
        // VEHICLES -> APPOINTMENTS
        // SERVICES -> APPOINTMENTS
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('vehicle_id')
                  ->constrained('vehicles')
                  ->cascadeOnDelete();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();
            $table->dateTime('appointment_date');
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // REPAIRS
        // APPOINTMENTS -> REPAIRS
        // EMPLOYEES -> REPAIRS
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')
                  ->unique()
                  ->constrained('appointments')
                  ->cascadeOnDelete();
            $table->foreignId('employee_id')
                  ->constrained('employees')
                  ->restrictOnDelete();
            $table->text('description')->nullable();
            $table->string('status')->default('in_progress');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop in reverse dependency order
        Schema::dropIfExists('repairs');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('services');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('users');
    }
};