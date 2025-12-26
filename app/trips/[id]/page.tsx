// app/trips/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TripDetailsPage({ params }: Props) {
    const { id } = await params;

    // 1. Fetch Trip AND Users (so we can choose who paid)
    const trip = await prisma.trip.findUnique({
        where: { id: id },
        include: { expenses: { include: { payer: true } } }, // Get expense AND the user who paid
    });

    const users = await prisma.user.findMany(); // Fetch all users for the dropdown

    if (!trip) return notFound();

    // --- NEW MATH LOGIC START ---

    // 1. Calculate Total Spent on Trip
    // We use "reduce" to loop through all expenses and add them up.
    // The "0" at the end is the starting number.
    const totalSpent = trip?.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

    // 2. Calculate "Fair Share" (Average)
    // If there are 0 users, avoid dividing by zero!
    const fairShare = users.length > 0 ? totalSpent / users.length : 0;

    // 3. Calculate Individual Balances
    const userBalances = users.map(user => {
        // How much did THIS user pay?
        const paid = trip?.expenses
            .filter(e => e.payerId === user.id)
            .reduce((sum, e) => sum + Number(e.amount), 0) || 0;

        // Net Balance = What they paid - What they SHOULD have paid
        const balance = paid - fairShare;

        return { ...user, paid, balance };
    });

    // --- NEW MATH LOGIC END ---

    // 2. The Server Action to Add an Expense
    async function addExpense(formData: FormData) {
        "use server"; // Runs on the server

        const description = formData.get("description") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const payerId = formData.get("payerId") as string;

        if (!payerId) return; // simple validation

        await prisma.expense.create({
            data: {
                description,
                amount,
                payerId,
                tripId: id,
            },
        });

        // Refresh the page to show new data
        redirect(`/trips/${id}`);
    }

    return (
        <main className="min-h-screen p-8 bg-gray-900 text-white">
            {/* Header */}
            <div className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-blue-500">{trip.name}</h1>
                <p className="text-gray-400">{trip.description}</p>
            </div>

            {/* --- NEW SUMMARY CARD --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                {/* Card 1: Total Cost */}
                <div className="bg-gray-800 p-4 rounded-lg border border-blue-900">
                    <p className="text-gray-400 text-sm">Total Trip Cost</p>
                    <p className="text-2xl font-bold text-blue-400">
                        ${totalSpent.toFixed(2)}
                    </p>
                </div>

                {/* Card 2: Cost Per Person */}
                <div className="bg-gray-800 p-4 rounded-lg border border-purple-900">
                    <p className="text-gray-400 text-sm">Per Person Share</p>
                    <p className="text-2xl font-bold text-purple-400">
                        ${fairShare.toFixed(2)}
                    </p>
                </div>

            </div>
            {/* ------------------------- */}

            {/* --- NEW BALANCES SECTION --- */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Who owes what?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userBalances.map((user) => (
                        <div
                            key={user.id}
                            className={`p-4 rounded-lg border ${user.balance >= 0
                                    ? "bg-green-900/20 border-green-800" // Green if they are owed money
                                    : "bg-red-900/20 border-red-800"     // Red if they owe money
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">{user.name}</span>
                                {user.balance >= 0 ? (
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full uppercase">Get Back</span>
                                ) : (
                                    <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded-full uppercase">Owes</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-400">Paid: ${user.paid.toFixed(2)}</p>

                            <p className={`text-xl font-bold mt-1 ${user.balance >= 0 ? "text-green-400" : "text-red-400"
                                }`}>
                                {user.balance >= 0 ? "+" : ""}${user.balance.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* ----------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT COLUMN: The "Add Expense" Form */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-green-400">Add New Expense</h2>
                    <form action={addExpense} className="space-y-4">

                        {/* Description */}
                        <input
                            name="description"
                            placeholder="What did you buy? (e.g. Dinner)"
                            required
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                        />

                        {/* Amount */}
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="Amount ($)"
                            required
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                        />

                        {/* Payer Dropdown */}
                        <select
                            name="payerId"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Who paid?</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>

                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 font-bold py-2 rounded">
                            Add Expense
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: The List of Expenses */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Expense History</h2>
                    {trip.expenses.length === 0 ? (
                        <p className="text-gray-500 italic">No expenses yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {trip.expenses.map((expense) => (
                                <li key={expense.id} className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                                    <div>
                                        <p className="font-bold">{expense.description}</p>
                                        <p className="text-xs text-gray-400">Paid by {expense.payer.name}</p>
                                    </div>
                                    <span className="text-green-400 font-mono font-bold">
                                        ${Number(expense.amount).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Link href="/" className="text-gray-400 hover:text-white underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
        </main>
    );
}