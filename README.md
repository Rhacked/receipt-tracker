Receipt Tracker is an app that allows you to extract and store information from images of receipts for tracking and
categorizing your daily spending.

## Getting Started

### Installation

1. Clone the repository

```sh
git clone https://github.com/Rhacked/receipt-tracker.git
cd receipt-tracker
```

2. Install NPM packages

```sh
npm ci
```

3. Set up environment variables

   Remember to substitute `YOUR_OPEN_AI_KEY`

```sh
echo "OPENAI_API_KEY=[YOUR_OPEN_AI_KEY]" > .env.local
```

4. Start the development server

```sh
npm run dev
```
