# Trip Splitter 💰

A full-stack expense-splitting application built with Next.js, Prisma, and PostgreSQL. Split expenses fairly among friends and track who owes what!

## 🎯 Features

- **User Management**: Create and manage users
- **Trip Management**: Organize expenses by trips
- **Expense Tracking**: Record who paid for what
- **Smart Calculations**: 
  - Automatic total cost calculation
  - Per-person fair share computation
  - Individual balance tracking
- **Debt Visualization**: Color-coded cards showing who owes money (red) and who should get paid back (green)
- **Cloud Database**: Production-ready PostgreSQL database hosted on Neon

## 🚀 Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Language**: TypeScript

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Parrybrar/Trip-Splitter.git
cd Trip-Splitter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="your_postgresql_connection_string"
```

4. Push the database schema:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Usage

1. **Create Users**: Click "+ New User" to add people to the system
2. **Create a Trip**: Click "+ New Trip" to start a new expense group
3. **Add Expenses**: 
   - Navigate to a trip
   - Fill in the expense description and amount
   - Select who paid
   - Click "Add Expense"
4. **View Balances**: See who owes what with color-coded cards:
   - 🟢 Green = Should get money back
   - 🔴 Red = Owes money

## 📊 How It Works

The app calculates expenses using a fair-share algorithm:

1. **Total Cost**: Sum of all expenses in a trip
2. **Fair Share**: Total cost ÷ Number of users
3. **Individual Balance**: Amount paid - Fair share
   - Positive balance = Should get money back
   - Negative balance = Owes money

## 🗂️ Project Structure

```
trip-splitter/
├── app/
│   ├── page.tsx              # Home page (dashboard)
│   ├── trips/
│   │   ├── [id]/
│   │   │   └── page.tsx      # Trip details & expense tracking
│   │   └── create/
│   │       └── page.tsx      # Create new trip
│   └── users/
│       └── create/
│           └── page.tsx      # Create new user
├── prisma/
│   └── schema.prisma         # Database schema
└── lib/
    └── prisma.ts             # Prisma client instance
```

## 🔮 Future Enhancements

- [ ] Edit/delete users, trips, and expenses
- [ ] Smart settlement suggestions (minimize transactions)
- [ ] Unequal splits (percentage-based or custom amounts)
- [ ] Expense categories and filtering
- [ ] Settlement tracking (mark debts as paid)
- [ ] Authentication and authorization
- [ ] Export trip summaries as PDF

## 📝 License

MIT

## 👤 Author

**Parry Brar**
- GitHub: [@Parrybrar](https://github.com/Parrybrar)

---

Built with ❤️ using Next.js and Prisma
