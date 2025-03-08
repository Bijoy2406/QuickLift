<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('riders', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID for rider
            $table->bigInteger('user_id')->unsigned()->nullable(); // Now optional
            $table->string('car_number');
            $table->string('car_details');
            $table->enum('availability', ['Available', 'Unavailable'])->default('Available');
            $table->timestamps();

            // Add unique rider ID
            $table->string('rider_id')->unique();
        });
    }

    public function down()
    {
        Schema::dropIfExists('riders');
    }
};