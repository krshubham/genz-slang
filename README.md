# GenZ Slang Dictionary 🔥

A modern web application that helps you understand and keep up with the latest GenZ slangs. Built with Next.js and TailwindCSS, featuring a beautiful dark theme UI with a dynamic search experience.

## Features

- 🔍 Real-time search with fuzzy matching
- 🎯 Exact and closest match suggestions
- 📱 Mobile-first responsive design
- 🌙 Beautiful dark theme with gradient animations
- 🔄 Trending slangs showcase
- 📤 Easy sharing functionality

## Running Locally

This is a [Next.js](https://nextjs.org) project. To run it locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/genz-slang.git
   cd genz-slang
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

### Adding New Slangs

The slang dictionary is maintained in `src/data/slang.json`. To add a new slang:

1. Fork the repository
2. Add your slang to the `slangs` array in `src/data/slang.json` following this format:
   ```json
   {
     "term": "your_slang",
     "meaning": "A clear and concise definition of the slang",
     "examples": [
       "Example usage in a sentence with **bold** slang term",
       "Another example with the **slang** highlighted"
     ]
   }
   ```
   Note: Use markdown formatting in the meaning and examples. Wrap the slang term in `**bold**` in examples.

3. Ensure your slang entry:
   - Has a unique term (not already in the dictionary)
   - Includes a clear, accurate meaning
   - Provides at least two practical examples
   - Uses proper markdown formatting

4. Create a pull request with your changes

### Development Guidelines

1. The project uses:
   - Next.js 15 with App Router
   - TailwindCSS for styling
   - TypeScript for type safety

2. Before submitting a PR:
   - Ensure your code follows the existing style
   - Test your changes locally
   - Update documentation if needed

## Feedback and Contributions

- 🐛 Found a bug? [Open an issue](https://github.com/krshubham/genz-slang/issues)
- 💡 Have a suggestion? [Create a pull request](https://github.com/krshubham/genz-slang/pulls)
- 📖 Know a slang we missed? Add it through:
  - A pull request following the guidelines above
  - Our [submission form](https://forms.gle/QNs6juDmg8rzxN2Z9)

## License

MIT License - feel free to use this project however you'd like!
