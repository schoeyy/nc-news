# News API

This API is built with express & postgreSQl and is a RESTful API that interacts with a news database containing articles, topics, users, and comments.

[Live Demo](https://nc-news-qami.onrender.com)

## Getting Started

Follow the instructions below to clone, install dependencies, seed the local database, and run tests.

### **Installing**

1. Clone the repository via SSH:

```bash
git clone git@github.com:schoeyy/nc-news.git
```

2. Install dependencies:

```bash
npm i
```

3. Create the two `.env` files:

- Create a `.env.development` file and add the following:

```bash
PGDATABASE=nc_news
```

- Create a `.env.test` file and add the following:

```bash
PGDATABASE=nc_news_test
```

4. Setup the local database:

```bash
npm run setup-dbs
```

4. Seed the local database:

```bash
npm run seed
```

5. Start the server:

```bash
npm start
```

## Testing

To run the tests, run the following command:

```bash
npm test
```

## Make sure you have the following installed:

- Node.js (v19 or higher)
- PostgreSQL (v14 or higher)
