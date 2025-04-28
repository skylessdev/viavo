// Example database configuration for Vercel Postgres
// This file is meant as a reference - actual implementation would use Drizzle ORM

module.exports = {
  development: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: "postgres",
    url: process.env.POSTGRES_URL,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

/*
Vercel Postgres environment variables to include:
- POSTGRES_URL
- POSTGRES_PRISMA_URL
- POSTGRES_URL_NON_POOLING 
- POSTGRES_USER
- POSTGRES_HOST
- POSTGRES_PASSWORD
- POSTGRES_DATABASE
*/