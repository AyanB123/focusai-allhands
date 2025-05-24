Below is a detailed document covering **ActivityWatch**, an open-source time-tracking application available on GitHub, including its features, technical details, funding, documentation, and more. This document is structured to provide a comprehensive overview based on your request for detailed information about ActivityWatch, its GitHub repository, funding, and documentation.

---

# Detailed Documentation: ActivityWatch

## 1. Overview
**ActivityWatch** is a free, open-source, cross-platform, and privacy-focused automated time-tracking application designed to help users understand how they spend time on their digital devices. It emphasizes extensibility, allowing users to customize and extend its functionality through plugins and watchers. The project prioritizes user privacy by storing data locally on the user's machine, avoiding cloud-based data collection unless explicitly configured.

- **GitHub Repository**: [ActivityWatch/activitywatch](https://github.com/ActivityWatch/activitywatch)
- **Official Website**: [activitywatch.net](https://activitywatch.net/)
- **License**: Mozilla Public License 2.0 (MPL-2.0)
- **Latest Release**: As of the latest updates, ActivityWatch is actively maintained, with releases tracked on GitHub.

## 2. Core Features
ActivityWatch collects and analyzes data on user activities across devices, offering insights into productivity and time management. Its key features include:

### 2.1 Time Tracking
- **Automatic Tracking**: Monitors active applications, window titles, browser tabs, and URLs without manual input.
- **AFK Detection**: Tracks periods of inactivity ("Away From Keyboard") using keyboard and mouse activity.
- **Cross-Platform Support**: Available on Windows, macOS, Linux, and Android (via `aw-server-rust` backend).

### 2.2 Categorization
- **Rule-Based Categorization**: Users can define rules to classify activities (e.g., labeling "Visual Studio Code" as "Coding" or "YouTube" as "Entertainment").
- **Basic AI Integration**: Utilizes simple machine learning for activity classification, though not as advanced as dedicated AI-driven tools. For example, it can group similar activities based on patterns.
- **Browser Extensions**: The `aw-watcher-web` extension ([GitHub](https://github.com/ActivityWatch/aw-watcher-web)) tracks time spent on websites, categorizing them based on user-defined rules.

### 2.3 Analysis
- **Visualizations**: Provides timelines, pie charts, and activity breakdowns through a web-based interface (`aw-webui`, built with Vue.js).
- **Reports**: Offers detailed reports on time spent per application, website, or category, with customizable time ranges (daily, weekly, monthly).
- **Productivity Insights**: Users can analyze productivity trends, such as time spent on "productive" vs. "distracting" activities.

### 2.4 Planning and Scheduling
- **Indirect Support**: While not a dedicated planner, ActivityWatch’s insights help users plan by identifying time sinks and optimizing schedules.
- **Goal Setting**: Users can set productivity goals based on tracked data (e.g., limiting time on social media).

### 2.5 Extensibility
- **Watchers**: Plugins that collect specific data, such as:
  - `aw-watcher-window`: Tracks active windows and their titles.
  - `aw-watcher-web`: Monitors browser activity (Chrome, Firefox).
  - Editor watchers for IDEs like VS Code, tracking coding time.
  - A full list is available in the [documentation](https://docs.activitywatch.net/en/latest/watchers.html).[](https://github.com/ActivityWatch/activitywatch)
- **API**: A REST API allows developers to integrate ActivityWatch with other tools or create custom watchers. Documentation is available at [docs.activitywatch.net](https://docs.activitywatch.net/en/latest/rest-api.html).[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)
- **Scripting Support**: Integrates with tools like Babashka (a Clojure scripting environment) for automating tasks, such as logging git activities.[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)

### 2.6 Privacy
- **Local Data Storage**: All data is stored on the user’s device by default, ensuring privacy.
- **Opt-In Data Collection**: Users control what data is tracked and can disable specific watchers.
- **Open-Source Transparency**: The codebase is publicly auditable, reducing privacy concerns compared to closed-source alternatives.

## 3. Technical Details
### 3.1 Architecture
ActivityWatch is modular, consisting of several components:
- **aw-core**: Core library for data handling and storage (no runnable modules).[](https://github.com/ActivityWatch/activitywatch)
- **aw-server**: Server for storing and managing Quantified Self data, written in Python or Rust (`aw-server-rust` for Android).[](https://github.com/ActivityWatch)
- **aw-client**: Client library for writing custom watchers.[](https://github.com/ActivityWatch/activitywatch)
- **aw-webui**: Web-based interface for visualizing data, built with Vue.js.[](https://github.com/ActivityWatch)
- **aw-qt**: System tray icon for managing ActivityWatch processes, built with Qt.[](https://github.com/orgs/ActivityWatch/repositories)

### 3.2 Data Model
- **Buckets**: Containers for storing activity data (e.g., a bucket for window activity or browser history).
- **Events**: Individual data points within a bucket, such as opening a specific application or visiting a website.
- **Heartbeats**: Frequent updates to track ongoing activities, reducing the need for redundant event creation.[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)

### 3.3 Installation
- **Pre-Built Binaries**: Available for Windows, macOS, Linux, and Android from [releases](https://github.com/ActivityWatch/activitywatch/releases).
- **Building from Source**: Instructions are provided in the [documentation](https://docs.activitywatch.net/en/latest/building.html).[](https://github.com/ActivityWatch/activitywatch)
- **Dependencies**: Requires Python for some components; `pip install .` or `poetry install` for development setups.[](https://github.com/ActivityWatch/docs)

### 3.4 Development
- **Languages**: Primarily Python, Rust (for performance-critical components), and Vue.js (for the web interface).
- **Contributing**: Guidelines are in [CONTRIBUTING.md](https://github.com/ActivityWatch/activitywatch/blob/master/CONTTRIBUTING.md). Developers can contribute by writing watchers, fixing bugs, or improving documentation.[](https://github.com/ActivityWatch/activitywatch)
- **CI/CD**: Continuous integration is managed via GitHub Actions, with an overview available on the repository.[](https://github.com/ActivityWatch/activitywatch)

## 4. Funding
ActivityWatch is a community-driven project with no corporate backing, relying on donations and sponsorships to sustain development. Below are the funding details:

### 4.1 GitHub Sponsors
- **Status**: ActivityWatch accepts contributions via GitHub Sponsors, managed by maintainers Erik Bjäreholt (@ErikBjare) and Johan Bjäreholt (@johan_bjareholt).
- **Recent Contribution**: On March 27, 2025, ActivityWatch received $105.00 USD via GitHub Sponsors, with a $10.50 USD host fee, contributing to a total of $4,675.94 USD in funds.[](https://opencollective.com/activitywatch/contributions/842127)
- **Purpose**: Funds support server costs, development time, and community engagement.

### 4.2 Open Collective
- **Platform**: ActivityWatch uses Open Collective for transparent funding management.
- **Donations**: Users can contribute one-time or recurring donations to support the project.
- **Transparency**: All transactions are publicly listed, ensuring accountability.

### 4.3 Funding Model
- **Volunteer-Driven**: Most development is done by volunteers, with maintainers dedicating significant personal time.
- **No Premium Features**: Unlike commercial tools like RescueTime, ActivityWatch offers all features for free, relying solely on community support.
- **Sustainability**: The project encourages contributions through code, documentation, or donations to maintain active development.

## 5. Documentation
ActivityWatch’s documentation is comprehensive and hosted at [docs.activitywatch.net](https://docs.activitywatch.net/), built using Read the Docs. Key sections include:

### 5.1 Getting Started
- **Installation Guide**: Step-by-step instructions for setting up ActivityWatch on various platforms.[](https://github.com/ActivityWatch/activitywatch)
- **Configuration**: Details on configuring buckets, watchers, and categorization rules.

### 5.2 Watchers
- **List of Watchers**: Documents all available watchers, including `aw-watcher-window`, `aw-watcher-web`, and editor-specific plugins.[](https://github.com/ActivityWatch/activitywatch)
- **Creating Watchers**: Guides for developers to build custom watchers using the `aw-client` library.

### 5.3 REST API
- **Endpoints**: Covers API endpoints for querying buckets, events, and heartbeats.[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)
- **Use Cases**: Examples include integrating ActivityWatch with other tools or automating data collection (e.g., tracking git activities with Babashka).[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)

### 5.4 Development
- **Building from Source**: Instructions for compiling ActivityWatch components.[](https://github.com/ActivityWatch/activitywatch)
- **Contributing**: Guidelines for submitting pull requests, reporting issues, or joining the community forum.

### 5.5 GitHub Documentation Repository
- **Repository**: [ActivityWatch/docs](https://github.com/ActivityWatch/docs)[](https://github.com/ActivityWatch/docs)
- **Content**: Source files for the documentation, allowing community contributions to improve clarity and coverage.
- **Setup**: Requires Python and dependencies like `pip` or `poetry` for local development.[](https://github.com/ActivityWatch/docs)

## 6. Community and Support
- **Forum**: The ActivityWatch forum ([forum.activitywatch.net](https://forum.activitywatch.net/)) is the primary platform for user support, feature requests, and discussions.[](https://github.com/ActivityWatch/activitywatch)
- **GitHub Issues**: Bugs and feature requests are tracked on the main repository ([GitHub Issues](https://github.com/ActivityWatch/activitywatch/issues)). As of recent updates, there are 47 open issues, with 2 needing help.[](https://github.com/ActivityWatch)
- **Contributors**: The project has a small but active team, with statistics generated via [contributor-stats](https://github.com/ActivityWatch/contributor-stats). Maintainers like Erik Bjäreholt and Johan Bjäreholt are among the top contributors.[](https://activitywatch.net/contributors/)
- **Newsletter**: Users can sign up for major announcements via the newsletter on the website.[](https://github.com/ActivityWatch/activitywatch)

## 7. Comparison with Requirements
Your request emphasized a GitHub-hosted tool for desktop planning, scheduling, screen time tracking, categorization, analysis, and AI integration. Here’s how ActivityWatch aligns:

- **GitHub Availability**: Hosted at [ActivityWatch/activitywatch](https://github.com/ActivityWatch/activitywatch), meeting your requirement for GitHub-only options.
- **Screen Time Tracking**: Automatically tracks application and browser usage, including AFK detection.[](https://github.com/ActivityWatch/activitywatch)
- **Categorization**: Supports rule-based and basic AI-driven categorization of activities and websites.[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)
- **Analysis**: Provides detailed visualizations and reports for productivity insights.[](https://github.com/ActivityWatch)
- **Planning and Scheduling**: Offers indirect support through goal-setting and time management insights, though not a dedicated planner.
- **AI Integration**: Includes basic machine learning for activity classification, but lacks advanced AI features like predictive scheduling.
- **Desktop Support**: Runs on Windows, macOS, and Linux, fulfilling the desktop requirement.[](https://github.com/ActivityWatch)

## 8. Limitations
- **No Advanced AI**: While it uses basic machine learning, ActivityWatch lacks sophisticated AI features like predictive analytics or automated scheduling, unlike commercial tools like Motion.
- **Manual Planning**: It’s not a dedicated planner, so users relying heavily on scheduling may need to complement it with tools like Super Productivity.
- **Learning Curve**: Setting up custom watchers or rules requires technical knowledge, which may be a barrier for non-technical users.
- **Funding Constraints**: As a volunteer-driven project, development pace depends on community contributions and donations, potentially limiting rapid feature additions.

## 9. Funding Impact and Future Outlook
- **Current Funding**: With $4,675.94 USD raised via GitHub Sponsors and Open Collective, ActivityWatch covers basic server costs and supports part-time development.[](https://opencollective.com/activitywatch/contributions/842127)
- **Future Needs**: Increased funding could enable full-time maintainers, faster feature development (e.g., advanced AI), and broader platform support.
- **Community Growth**: The project’s extensibility and privacy focus attract developers, but more contributors are needed to expand watcher ecosystems and documentation.

## 10. Recommendations
- **For General Users**: Install ActivityWatch to gain insights into your digital habits. Start with default watchers (`aw-watcher-window`, `aw-watcher-web`) and explore the web interface for visualizations.
- **For Developers**: Contribute by creating custom watchers (e.g., for specific IDEs or tools) or improving the REST API. Check [CONTRIBUTING.md](https://github.com/ActivityWatch/activitywatch/blob/master/CONTTRIBUTING.md) for guidelines.
- **For Privacy-Conscious Users**: Leverage ActivityWatch’s local storage and disable unwanted watchers to minimize data collection.
- **For Funding Support**: Consider donating via GitHub Sponsors or Open Collective to ensure continued development.

## 11. Key Resources
- **Main Repository**: [github.com/ActivityWatch/activitywatch](https://github.com/ActivityWatch/activitywatch)[](https://github.com/ActivityWatch/activitywatch)
- **Documentation**: [docs.activitywatch.net](https://docs.activitywatch.net/)[](https://github.com/ActivityWatch/docs)
- **Forum**: [forum.activitywatch.net](https://forum.activitywatch.net/)[](https://github.com/ActivityWatch/activitywatch)
- **Funding**: [opencollective.com/activitywatch](https://opencollective.com/activitywatch)[](https://opencollective.com/activitywatch/contributions/842127)
- **Website**: [activitywatch.net](https://activitywatch.net/)[](https://github.com/ActivityWatch)
- **Browser Extensions**:
  - Chrome: [aw-watcher-web](https://chromewebstore.google.com/detail/activitywatch-web-watcher/nglaklhklhcoonedhgnpgddginnjdadi)[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)
  - Firefox: [aw-watcher-web](https://addons.mozilla.org/en-US/firefox/addon/aw-watcher-web/)[](https://medium.com/%40flexianadevgroup/tracking-working-hours-in-activitywatch-based-on-git-activities-370135ca9ecc)

## 12. Conclusion
ActivityWatch is a powerful, privacy-first time-tracking tool that meets most of your requirements for a GitHub-hosted desktop application. Its automatic tracking, categorization, and analysis features make it ideal for understanding digital habits, while its open-source nature and extensibility appeal to developers. Although it lacks advanced AI and dedicated planning features, its community-driven development and transparent funding model ensure ongoing improvements. By leveraging its documentation and contributing to its ecosystem, users can tailor ActivityWatch to their specific needs, making it a versatile choice for productivity tracking.

---

If you need further details, specific setup instructions, or assistance with contributing to ActivityWatch, please let me know!