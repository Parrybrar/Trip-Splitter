// src/app/page.tsx
export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const users = await prisma.user.findMany();
  const trips = await prisma.trip.findMany(); // Now fetching trips too!

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">Trip Splitter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">

        {/* COLUMN 1: USERS */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-2xl font-semibold">Users</h2>
            <Link
              href="/users/create"
              className="text-sm bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition"
            >
              + New User
            </Link>
          </div>
          {users.length === 0 ? (
            <p className="text-gray-400">No users yet.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                  {user.name} <span className="text-xs text-gray-500">({user.email})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* COLUMN 2: TRIPS */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-2xl font-semibold">Trips</h2>
            <Link
              href="/trips/create"
              className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition"
            >
              + New Trip
            </Link>
          </div>

          {trips.length === 0 ? (
            <p className="text-gray-400 italic">
              No trips planned. <br />
              <Link href="/trips/create" className="text-blue-400 underline">Create one!</Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {trips.map((trip) => (
                // This Link wraps the whole card so you can click it
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <li className="p-4 bg-gray-800 rounded border border-gray-600 hover:border-blue-500 transition cursor-pointer mb-2">
                    <h3 className="font-bold text-lg">{trip.name}</h3>
                    <p className="text-gray-400 text-sm">{trip.description || "No description"}</p>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>

      </div>
    </main>
  );
}