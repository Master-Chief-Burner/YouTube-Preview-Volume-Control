# Contributing to YouTube Preview Volume Control

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your Chrome version and OS
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been requested
- Explain the use case and benefit
- Be specific about the desired behavior

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Comment your code where necessary
   - Test thoroughly on YouTube
4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**

## Code Style Guidelines

- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Test on multiple YouTube pages (home, watch, shorts, etc.)

## Testing Checklist

Before submitting a PR, please test:
- Hover previews work correctly
- Main video player is not affected
- YouTube Shorts are not affected
- Volume slider updates work in real-time
- Settings persist after browser restart
- No console errors

## Performance Considerations

When making changes, consider:
- CPU usage impact (test on lower-end systems if possible)
- Memory leaks (remove event listeners when appropriate)
- Scanning frequency (balance between responsiveness and performance)

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make this extension better!