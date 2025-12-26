// app/trips/create/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CreateTripPage() {
    // Server Action to create a new trip
    async function createTrip(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        if (!name) return; // Simple validation

        const newTrip = await prisma.trip.create({
            data: {
                name,
                description: description || "",
            },
        });

        // Redirect to the newly created trip's detail page
        redirect(`/trips/${newTrip.id}`);
    }

    return (
        <main className="min-h-screen p-8 bg-gray-900 text-white flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-blue-500">Create New Trip</h1>

                <form action={createTrip} className="space-y-4">
                    {/* Trip Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Trip Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="e.g., Weekend Getaway"
                            required
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                        <textarea
                            name="description"
                            placeholder="What's this trip about?"
                            rows={4}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded transition"
                        >
                            Create Trip
                        </button>
                        <Link
                            href="/"
                            className="flex-1 bg-gray-700 hover:bg-gray-600 font-bold py-3 rounded transition text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
