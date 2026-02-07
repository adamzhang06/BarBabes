# SafeRound – Development Build (Android)

The app uses **native modules** (`react-native-nfc-manager`, `expo-sensors`) that are **not included in Expo Go**. You must use a **Development Build** so those modules are compiled into the app.

## Prerequisites

- Node.js and npm installed
- **Android:** Android Studio with SDK and a device/emulator (see **Android SDK setup** below)
- (Optional) **iOS:** Xcode on macOS for iOS simulator/device

---

## Android SDK setup (Windows)

If `npx expo run:android` fails with **"Failed to resolve the Android SDK path"** or **"'adb' is not recognized"**, the Android SDK is either not installed or not on your PATH.

### Option A: Install Android Studio (recommended)

1. **Download and install [Android Studio](https://developer.android.com/studio)**.
2. Open Android Studio → **More Actions** → **SDK Manager** (or **File → Settings → Appearance & Behavior → System Settings → Android SDK**).
3. Note the **Android SDK Location** (e.g. `C:\Users\YourName\AppData\Local\Android\Sdk`).
4. Under **SDK Tools**, ensure **Android SDK Platform-Tools** is installed (this provides `adb`).

### Set environment variables

Set **ANDROID_HOME** (and add platform-tools to **PATH**) so Expo and Gradle can find the SDK.

**PowerShell (current session only):**

```powershell
$sdkPath = "C:\Users\Azeem\AppData\Local\Android\Sdk"
$env:ANDROID_HOME = $sdkPath
$env:Path += ";$sdkPath\platform-tools;$sdkPath\emulator"
```

**Permanent (Windows):**

1. **Win + R** → `sysdm.cpl` → **Advanced** → **Environment Variables**.
2. Under **User variables** (or **System variables**):
   - **New** → Variable name: `ANDROID_HOME` → Value: `C:\Users\Azeem\AppData\Local\Android\Sdk`  
     (Use your actual SDK path from SDK Manager if different.)
   - Edit **Path** → **New** → add:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\emulator`
3. **OK** to save. Close and reopen the terminal (or restart) so the new PATH is picked up.

### Verify

In a **new** terminal:

```powershell
echo $env:ANDROID_HOME
adb version
```

You should see the SDK path and adb version. Then from `apps/mobile`:

```bash
npx expo run:android
```

### Option B: SDK installed elsewhere

If you already installed the SDK in a different folder (e.g. via Android Studio in another drive), set `ANDROID_HOME` to that path and add `%ANDROID_HOME%\platform-tools` to PATH as above.

## Commands (run inside `apps/mobile`)

### 1. Install dependencies (including expo-dev-client)

```bash
cd apps/mobile
npm install
```

### 2. Generate native projects (prebuild)

This creates the `android/` (and optionally `ios/`) folders with the native code that includes your native modules.

```bash
npx expo prebuild
```

- Use `npx expo prebuild --clean` if you already have `android/` or `ios/` and want to regenerate from scratch.
- For Android only you can run: `npx expo prebuild --platform android`

### 3. Run the Development Build

**Android (device or emulator):**

```bash
npx expo run:android
```

This builds the native app and installs it on your connected device or running emulator. After the first build, you can use the same command to rebuild and run, or open the project in Android Studio and run from there.

**iOS (macOS only):**

```bash
npx expo run:ios
```

### 4. Start the dev server (if not already running)

In a separate terminal, from `apps/mobile`:

```bash
npx expo start
```

Then open the development build app on your device; it will connect to the bundler and load your JS.

---

## Summary

| Step | Command |
|------|--------|
| Install deps | `npm install` |
| Generate native projects | `npx expo prebuild` |
| Run Android build | `npx expo run:android` |
| Start JS bundler | `npx expo start` |

After the first `expo run:android`, the installed app is your **development build**. Use it instead of Expo Go when developing with NFC, sensors, or other custom native code.
