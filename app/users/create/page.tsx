// app/users/create/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CreateUserPage() {
    // Server Action to create a new user
    async function createUser(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;

        if (!name || !email) return; // Simple validation

        await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        // Redirect back to home page
        redirect("/");
    }

    return (
        <main className="min-h-screen p-8 bg-gray-900 text-white flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-blue-500">Add New User</h1>

                <form action={createUser} className="space-y-4">
                    {/* User Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="e.g., Founder"
                            required
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="e.g., founder@example.com"
                            required
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded transition"
                        >
                            Add User
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
