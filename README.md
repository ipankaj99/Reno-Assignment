# Reno Platforms Notice Board

A full-stack Notice Board application built for the Reno Platforms Web Development Assignment. 

## Tech Stack Used
* **Framework:** Next.js (Pages Router)
* **Database Access:** Prisma
* **Database:** Serverless PostgreSQL (Neon)
* **Styling:** Tailwind CSS
* **Deployment:** Vercel (Hobby Tier)

## How to run the project locally

1. Clone the repository: `git clone [YOUR_GITHUB_REPO_LINK]`
2. Navigate to the directory: `cd reno-notice-board`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add your PostgreSQL database URL:
   `DATABASE_URL="your_postgresql_url"`
5. Push the Prisma schema to the database: `npx prisma db push`
6. Generate the Prisma Client: `npx prisma generate`
7. Start the development server: `npm run dev`
8. Open `http://localhost:3000` in your browser.
