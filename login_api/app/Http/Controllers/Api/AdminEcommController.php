<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\MediaStorage;
use Illuminate\Http\Request;

class AdminEcommController extends Controller
{
    // ======================================
    // CATEGORY MANAGEMENT
    // ======================================
    public function getCategories()
    {
        return response()->json([
            'status' => 'success',
            'data' => Category::orderBy('id', 'desc')->get()
        ]);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $category = new Category();
        $category->name = $request->name;

        if ($request->hasFile('image')) {
            $category->image = MediaStorage::store($request->file('image'), 'categories');
        }

        $category->status = $request->has('status') ? filter_var($request->status, FILTER_VALIDATE_BOOLEAN) : 1;
        $category->save();

        return response()->json(['status' => 'success', 'message' => 'Category added successfully!', 'data' => $category]);
    }

    public function getCategory($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        
        return response()->json(['status' => 'success', 'data' => $category]);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $category->name = $request->name;

        if ($request->hasFile('image')) {
            $category->image = MediaStorage::store($request->file('image'), 'categories');
        }

        if ($request->has('status')) {
            $category->status = filter_var($request->status, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }
        
        $category->save();

        return response()->json(['status' => 'success', 'message' => 'Category updated successfully!', 'data' => $category]);
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        
        $category->delete();
        return response()->json(['status' => 'success', 'message' => 'Category deleted successfully']);
    }

    // ======================================
    // PRODUCT MANAGEMENT
    // ======================================
    public function getProducts()
    {
        return response()->json([
            'status' => 'success',
            'data' => Product::with('category')->orderBy('id', 'desc')->get()
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $product = new Product();
        $product->category_id = $request->category_id;
        $product->name = $request->name;
        $product->description = $request->description;
        $product->benefits = $request->benefits;
        $product->bead_count = $request->bead_count;
        $product->bead_size = $request->bead_size;
        $product->seed_type = $request->seed_type;
        $product->thread_type = $request->thread_type;
        $product->origin = $request->origin;
        $product->price = $request->price;

        if ($request->hasFile('image')) {
            $product->image = MediaStorage::store($request->file('image'), 'products');
        }

        $product->is_trending = $request->has('is_trending') ? filter_var($request->is_trending, FILTER_VALIDATE_BOOLEAN) : 0;
        $product->status = $request->has('status') ? filter_var($request->status, FILTER_VALIDATE_BOOLEAN) : 1;
        $product->save();

        return response()->json(['status' => 'success', 'message' => 'Product added successfully!', 'data' => $product]);
    }

    public function getProduct($id)
    {
        $product = Product::with('category')->find($id);
        if (!$product) return response()->json(['status' => 'error', 'message' => 'Product not found'], 404);
        
        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['status' => 'error', 'message' => 'Product not found'], 404);

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $product->category_id = $request->category_id;
        $product->name = $request->name;
        $product->description = $request->description;
        $product->benefits = $request->benefits;
        $product->bead_count = $request->bead_count;
        $product->bead_size = $request->bead_size;
        $product->seed_type = $request->seed_type;
        $product->thread_type = $request->thread_type;
        $product->origin = $request->origin;
        $product->price = $request->price;

        if ($request->hasFile('image')) {
            $product->image = MediaStorage::store($request->file('image'), 'products');
        }

        if ($request->has('is_trending')) {
            $product->is_trending = filter_var($request->is_trending, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }
        if ($request->has('status')) {
            $product->status = filter_var($request->status, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }
        
        $product->save();

        return response()->json(['status' => 'success', 'message' => 'Product updated successfully!', 'data' => $product]);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['status' => 'error', 'message' => 'Product not found'], 404);
        
        $product->delete();
        return response()->json(['status' => 'success', 'message' => 'Product deleted successfully']);
    }
}
