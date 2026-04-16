<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ritual_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('service_type')->nullable();
            $table->string('category')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->text('benefits')->nullable();
            $table->text('materials_required')->nullable();
            $table->string('ideal_timing')->nullable();
            $table->string('duration_label')->nullable();
            $table->string('mode')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('status')->default(true);
            $table->json('steps')->nullable();
            $table->json('materials')->nullable();
            $table->json('faqs')->nullable();
            $table->json('mantras')->nullable();
            $table->foreignId('assigned_astrologer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        $seedData = [
            ['Ganesh Chaturthi Maha Pooja', 'Pooja', 'Vedic Rituals', 'A comprehensive ritual to invoke the blessings of Lord Ganesha for new beginnings and obstacle removal.', 'Removes obstacles and supports auspicious new beginnings.', 'Modak, durva grass, flowers, diya, kalash', 'Ganesh Chaturthi, Wednesdays, before major new ventures', '120 Mins', 'Online/Offline', 2500, true],
            ['Satyanarayan Katha', 'Katha', 'Family Well-being', 'Sacred storytelling ritual of Lord Vishnu performed for peace, prosperity, and divine protection in the household.', 'Invites prosperity, harmony, and spiritual merit into the home.', 'Satyanarayan katha book, fruits, tulsi leaves, panchamrit', 'Purnima, Ekadashi, house milestones', '180 Mins', 'Online/Offline', 3500, false],
            ['Griha Pravesh Shanti', 'Pooja', 'New Beginnings', 'House warming ceremony with purification rituals, vastu balancing, and blessings for the new home.', 'Purifies the home and stabilizes family energies before moving in.', 'Kalash, mango leaves, havan samagri, coconut, grains', 'Before entering a new home, on an auspicious muhurat', '240 Mins', 'Offline', 5100, true],
            ['Maha Mrityunjaya Jaap', 'Jap', 'Health & Longevity', 'Potent Vedic chant dedicated to Lord Shiva for recovery, longevity, vitality, and spiritual protection.', 'Supports health recovery and strengthens protective energies.', 'Rudraksha mala, milk, belpatra, ghee diya', 'Mondays, mornings, during health-related concerns', '60 Mins', 'Online/Offline', 1500, false],
            ['Navgraha Shanti Pooja', 'Grah Shanti', 'Astrological Remedies', 'Ritual to harmonize the nine planets and reduce doshas influencing marriage, health, finance, and career.', 'Balances planetary energies and reduces karmic friction.', 'Navgraha items, colored cloth, grains, havan samagri', 'As per kundli, Saturdays, or special remedy dates', '150 Mins', 'Online/Offline', 4200, false],
            ['Rudra Abhishek', 'Pooja', 'Devotional', 'Powerful Shiva ritual with abhishek offerings to invoke peace, success, purification, and divine blessings.', 'Brings peace, removes negativity, and supports spiritual discipline.', 'Milk, honey, belpatra, flowers, sacred water', 'Mondays, Shravan month, Maha Shivratri', '90 Mins', 'Offline', 2100, false],
            ['Shiv Puran Katha', 'Katha', 'Spiritual Growth', 'Sacred katha dedicated to Lord Shiva that supports peace, prosperity, and spiritual upliftment.', 'Removes negativity and deepens devotional connection.', 'Belpatra, Shivling, flowers, fruits, diya', 'Mondays, Shravan month, Shivratri', '3-7 Days', 'Online/Offline', 11000, false],
            ['Sundarkand Path', 'Path', 'Courage & Protection', 'Recitation from the Ramayana for courage, success, and relief from fear, delays, and negativity.', 'Strengthens mental resilience and protective grace.', 'Hanuman idol, sindoor, flowers, diya', 'Tuesdays, Saturdays, before important undertakings', '1 Day', 'Online/Offline', 1800, false],
            ['Lakshmi Beej Mantra Anusthan', 'Anusthan', 'Prosperity', 'Continuous mantra chanting ritual to invite abundance, financial stability, and grace from Goddess Lakshmi.', 'Supports wealth flow and financial steadiness.', 'Lotus, coins, diya, red cloth', 'Fridays, Diwali period, wealth remedies', '3-5 Days', 'Online/Offline', 5400, false],
            ['Vastu Poojan', 'Vastu', 'Space Harmony', 'Vedic ritual for homes or offices to clear stuck energy, harmonize vastu, and invite peace and prosperity.', 'Helps correct vastu imbalance and supports harmonious living.', 'Kalash, coconut, grains, havan samagri', 'Before entering property or after renovations', '1 Day', 'Offline', 3200, false],
            ['Kaal Sarp Dosh Puja', 'Dosh Nivaran', 'Remedial Rituals', 'Traditional puja to reduce the negative impact of Kaal Sarp Dosh and restore stability and progress.', 'Supports relief from obstacles, instability, and recurring setbacks.', 'Milk, black sesame, snake idol offerings, havan samagri', 'Nag Panchami or remedy muhurat as per kundli', '1 Day', 'Offline', 4800, false],
            ['Mangal Dosh Puja', 'Dosh Nivaran', 'Marriage Remedies', 'Remedial puja to reduce marriage delays and relationship stress caused by Mars afflictions in the chart.', 'Helps stabilize relationships and reduce Mangal-related obstacles.', 'Red cloth, masoor dal, flowers, diya', 'Tuesdays or marriage-related auspicious dates', '1 Day', 'Online/Offline', 2600, false],
            ['Santan Gopal Anusthan', 'Anusthan', 'Child Blessings', 'Sacred ritual for fertility, healthy progeny, and blessings for couples seeking child birth.', 'Invokes divine support for child blessing and family growth.', 'Krishna idol, sweets, tulsi leaves, flowers', 'Krishna-related auspicious days', '3-5 Days', 'Online/Offline', 6100, false],
            ['Baglamukhi Anusthan', 'Anusthan', 'Victory & Protection', 'A focused ritual for victory in disputes, legal matters, enemy protection, and spiritual shielding.', 'Useful for court cases, opposition, and protection work.', 'Yellow cloth, havan samagri, turmeric, flowers', 'Thursdays and specific remedy muhurtas', '3-5 Days', 'Offline', 7200, true],
            ['Bhoomi Pujan', 'Vastu', 'Construction Blessings', 'Foundation ritual before construction to seek divine blessings and remove future obstacles from the land.', 'Supports safe construction and long-term property stability.', 'Haldi, coconut, bhoomi pujan samagri, flowers', 'Before construction starts', '1 Day', 'Offline', 4100, false],
        ];

        foreach ($seedData as [$name, $serviceType, $category, $shortDescription, $benefits, $materialsRequired, $idealTiming, $durationLabel, $mode, $price, $isPopular]) {
            DB::table('ritual_services')->insert([
                'name' => $name,
                'slug' => Str::slug($name),
                'service_type' => $serviceType,
                'category' => $category,
                'short_description' => $shortDescription,
                'description' => $shortDescription . ' This ritual is coordinated with verified priests and traditional Vedic procedures so the devotee receives both spiritual guidance and a structured execution plan.',
                'benefits' => $benefits,
                'materials_required' => $materialsRequired,
                'ideal_timing' => $idealTiming,
                'duration_label' => $durationLabel,
                'mode' => $mode,
                'price' => $price,
                'is_popular' => $isPopular,
                'status' => true,
                'steps' => json_encode([
                    'Sankalp and devotee intention setting',
                    'Ganesh invocation and purification rites',
                    'Main ritual sequence with mantra chanting and offerings',
                    'Aarti, blessings, and completion guidance for the devotee',
                ]),
                'materials' => json_encode(collect(explode(',', $materialsRequired))->map(fn ($item) => trim($item))->filter()->values()->all()),
                'faqs' => json_encode([
                    ['question' => 'Can this ritual be performed online?', 'answer' => 'Yes. When mode allows online participation, the priest coordinates the sankalp and key offerings live with the devotee.'],
                    ['question' => 'Do you provide the full samagri list?', 'answer' => 'Yes. After booking, the devotee receives the detailed materials checklist and preparation guidance.'],
                ]),
                'mantras' => json_encode([
                    'Opening sankalp mantra',
                    'Primary deity invocation mantra',
                    'Closing shanti mantra',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ritual_services');
    }
};
