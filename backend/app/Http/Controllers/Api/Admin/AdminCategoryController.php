<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /** List all categories (including inactive) for admin product management */
    public function index()
    {
        $categories = Category::orderBy('name')->get();
        return response()->json($categories);
    }

    /** Create a new category – requires manage_products permission */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|url',
            'is_active' => 'boolean',
        ]);

        $baseSlug = Str::slug($data['name']);
        $slug = $baseSlug;
        $attempt = 0;
        while (Category::where('slug', $slug)->exists()) {
            $attempt++;
            $slug = $baseSlug . '-' . $attempt;
        }

        $data['slug'] = $slug;
        $data['is_active'] = $data['is_active'] ?? true;
        $category = Category::create($data);

        return response()->json($category, 201);
    }
}
