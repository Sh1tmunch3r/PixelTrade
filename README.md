# PixelTrade

A modern web-based application marketplace with a cyberpunk-themed interface for browsing, downloading, and managing digital tools and applications.

## Overview

PixelTrade is a Flask-based web application that serves as a digital marketplace, featuring a sleek, cyberpunk-inspired UI. The platform allows users to browse various applications across multiple categories including Development, Utilities, Networking & Security, and Media & Design. The project includes both a web interface and a PyQt5-based desktop client application.

## Purpose

PixelTrade demonstrates a full-stack marketplace implementation with:
- Dynamic content loading from JSON manifests
- Real-time file metadata generation and management
- Responsive, modern UI with animations and modal interactions
- Category-based application organization
- File download and management capabilities

The project serves as both a functional marketplace and a demonstration of web security concepts, including clickjacking prevention techniques.

## Main Features

- **🎨 Modern Cyberpunk UI**: Stunning gradient backgrounds, neon accents, and smooth animations
- **📦 Application Marketplace**: Browse and download tools across multiple categories
- **🔍 Dynamic Content Loading**: Applications loaded dynamically via API from JSON manifests
- **📊 File Metadata Management**: Automatic scanning and tracking of file information (size, dates, etc.)
- **🖥️ Desktop Client**: PyQt5-based standalone application for local marketplace access
- **🛡️ Security Demonstrations**: Includes examples for understanding web security concepts
- **📱 Responsive Design**: Mobile-friendly interface that adapts to different screen sizes
- **⚡ Real-time Updates**: File information automatically gathered on server startup

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Desktop Client**: PyQt5
- **Data Format**: JSON for application manifests and file metadata

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sh1tmunch3r/PixelTrade.git
   cd PixelTrade
   ```

2. **Install dependencies**
   ```bash
   pip install flask
   ```
   
   For the desktop client, additionally install:
   ```bash
   pip install PyQt5
   ```

3. **Verify directory structure**
   
   Ensure the following directories exist:
   ```
   PixelTrade/
   ├── server.py
   ├── base/
   │   └── apps/
   │       └── info/
   │           ├── apps_manifest.json
   │           └── file_info.json (auto-generated)
   ├── static/
   │   └── base/
   │       └── [application files]
   └── templates/
       ├── pixelmarket.html
       └── dldr.html
   ```

### Running the Application

1. **Start the Flask server**
   ```bash
   python server.py
   ```

2. **Access the web interface**
   
   Open your browser and navigate to:
   ```
   http://localhost:5221
   ```

3. **Run the desktop client (optional)**
   ```bash
   python static/base/pixel-market-place_v0.0.1/pixel.py
   ```

### Configuration

The server runs on port 5221 by default. To change this, modify the last line in `server.py`:
```python
app.run(debug=True, host='0.0.0.0', port=YOUR_PORT)
```

## Project Structure

```
PixelTrade/
├── server.py                  # Main Flask application server
├── base/
│   └── apps/
│       └── info/
│           ├── apps_manifest.json    # Application definitions
│           └── file_info.json        # Auto-generated file metadata
├── static/
│   └── base/                  # Static files and downloadable applications
│       ├── pixel-market-place_v0.0.1/
│       │   └── pixel.py       # PyQt5 desktop client
│       └── [other apps]       # Various application files
└── templates/
    ├── pixelmarket.html       # Main marketplace interface
    └── dldr.html              # Download demonstration page
```

## Usage

### Adding New Applications

To add a new application to the marketplace:

1. Place your application file in the `static/base/` directory
2. Add an entry to `base/apps/info/apps_manifest.json`:

```json
{
    "id": "uniqueAppId",
    "file_name": "your_app_v1.0.0.zip",
    "category": "Development",
    "icon": "🔧",
    "title": "Your App Name",
    "short_desc": "Brief description",
    "long_desc": "Detailed description of your application",
    "features": [
        "Feature 1",
        "Feature 2",
        "Feature 3"
    ],
    "version": "1.0.0",
    "release_date": "2024-01-01",
    "isDecoy": false
}
```

3. Restart the server to generate updated file metadata

### API Endpoints

- `GET /` - Main marketplace page
- `GET /api/get_apps_data` - JSON API for application data
- `GET /target` - Clickjacking demonstration page
- `GET /file_demo` - File system demo page

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
   
   Click the 'Fork' button at the top right of this page

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   
   - Follow existing code style and conventions
   - Test your changes thoroughly
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   
   Go to the original repository and click 'New Pull Request'

### Contribution Guidelines

- Write clear, descriptive commit messages
- Ensure code is properly formatted and follows Python PEP 8 style guide
- Test your changes before submitting
- Update README if you're adding new features
- Be respectful and constructive in discussions

## License

**License information is not currently specified for this project.**

If you're the project owner, consider adding a LICENSE file with an appropriate open-source license (MIT, Apache 2.0, GPL, etc.) to clarify usage rights and restrictions.

## Security Note

This project includes demonstrations of web security concepts, including clickjacking scenarios. These are for **educational purposes only**. Please use this knowledge responsibly and ethically.

## Contact

- **Repository**: [https://github.com/Sh1tmunch3r/PixelTrade](https://github.com/Sh1tmunch3r/PixelTrade)
- **Issues**: [https://github.com/Sh1tmunch3r/PixelTrade/issues](https://github.com/Sh1tmunch3r/PixelTrade/issues)

For bug reports, feature requests, or questions, please open an issue on GitHub.

## Acknowledgments

- Built with Flask and PyQt5
- Cyberpunk UI inspired by modern design trends
- Uses Orbitron and Roboto fonts from Google Fonts

---

**Note**: This project is under active development. Features and documentation may change.
