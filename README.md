# Status Sanctuary

Import this repository https://github.com/conduciveadvertise/W-Status-Saver.git

Redesign the existing React Native Expo app.



Do NOT recreate the project.



Do NOT change the project structure.



Do NOT change navigation.



Do NOT add backend or functionality.



Only redesign and polish the UI.



Use the uploaded W Status Saver logo as the app branding.



Transform every screen into a world-class premium Android interface.



Requirements:



- WhatsApp-inspired green theme (original, not copied)

- Material 3 design

- Luxury premium look

- Beautiful typography

- Perfect spacing

- Rounded cards (24dp)

- Soft shadows

- Glassmorphism where appropriate

- Modern icons

- Smooth animations

- Premium bottom navigation

- Premium app bar

- Premium status cards

- Consistent design system

- Reusable UI components

- Responsive for all Android screen sizes



Redesign these existing screens only:

- Home

- Images

- Videos

- Saved

- Favorites

- Settings

- Image Viewer

- Video Player

- Permission Screen



Improve every component until the UI looks better than any Status Saver app on Google Play.



After redesigning:

- Run the build.

- Fix all UI issues.

- Do NOT commit.

- Do NOT push.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://luxe-save.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f033995f-2240-470b-9acc-2ae16cac7d6c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Android APK Testing (GitHub Actions)

This repository includes an automated GitHub Actions workflow to build a **Debug APK** for testing on physical Android devices (supports Android 6.0 / API level 23 and above).

### How to Trigger the APK Build
1. Push changes to the `main` or `master` branch (build triggers automatically).
2. Or trigger manually via GitHub Actions:
   - Go to your repository on GitHub.
   - Click the **Actions** tab.
   - Select the **Build Android Debug APK** workflow from the left sidebar.
   - Click **Run workflow** and select the branch to build.

### Downloading the Generated APK
1. Once the workflow completes, click on the specific workflow run in the **Actions** tab.
2. Scroll down to the **Artifacts** section at the bottom of the summary page.
3. Download the artifact named **`W-Status-Saver-debug-apk`**.
4. Extract the ZIP file to obtain `app-debug.apk` and install it directly on your Android phone.

