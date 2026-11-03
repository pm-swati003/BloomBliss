<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with('user');

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $query->orderBy('created_at', 'desc');

        $limit = (int) $request->get('limit');
        $reviews = $limit > 0 ? $query->limit($limit)->get() : $query->get();

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Thank you + promote more orders notification
        Notification::create([
            'user_id' => auth()->id(),
            'type' => 'review_thank_you',
            'title' => 'Thank you for your review!',
            'body' => 'Your feedback helps others. Love our blooms? Order more and spread the joy – shop now.',
            'data' => [
                'product_id' => (int) $request->product_id,
                'review_id' => $review->id,
            ],
        ]);

        return response()->json($review->load('user'), 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::where('user_id', auth()->id())
            ->findOrFail($id);

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string',
        ]);

        $review->update($request->only(['rating', 'comment']));

        return response()->json($review->load('user'));
    }

    public function destroy($id)
    {
        $review = Review::where('user_id', auth()->id())
            ->findOrFail($id);

        $review->delete();

        return response()->json(['message' => 'Review deleted']);
    }
}
