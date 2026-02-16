# 🛠️ Mobile Development Environment Setup Tutorial

Complete step-by-step guide for setting up Ascended Social authentication in your mobile project.

## 📋 Prerequisites

- Backend server running (`npm run dev`)
- Replit OAuth credentials configured
- Mobile development environment available (iOS Simulator, Android Emulator, or physical device)

---

## Part 1: iOS Setup (Swift)

### Step 1: Create AuthManager Class

```swift
import Foundation

struct MobileConfig: Codable {
    let replitClientId: String
    let backendDomain: String
    let mobileDevDomain: String
    let deepLinkScheme: String
    let apiBaseUrl: String
    let scopes: [String]
}

struct AuthResponse: Codable {
    let success: Bool
    let user: User?
    let error: String?
    
    struct User: Codable {
        let id: String
        let email: String
        let firstName: String?
        let lastName: String?
    }
}

@MainActor
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var user: AuthResponse.User?
    @Published var config: MobileConfig?
    @Published var errorMessage: String?
    
    private let backendURL = "http://localhost:3000" // Change for prod
    private let keychainService = "com.ascended.social.auth"
    
    // MARK: - Initialize Config
    
    func loadConfig() async {
        guard let url = URL(string: "\(backendURL)/api/mobile-config") else {
            errorMessage = "Invalid URL"
            return
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                errorMessage = "Failed to load config"
                return
            }
            
            let config = try JSONDecoder().decode(MobileConfig.self, from: data)
            self.config = config
            print("✅ Mobile config loaded")
        } catch {
            errorMessage = "Error loading config: \(error.localizedDescription)"
            print("❌ Config error: \(error)")
        }
    }
    
    // MARK: - Start Login
    
    func startLogin() async {
        guard let config = config else {
            errorMessage = "Config not loaded"
            return
        }
        
        let platform = "native"
        let redirectUri = "\(config.deepLinkScheme)auth/callback"
        
        let loginUrl = "\(backendURL)/api/mobile-login?platform=\(platform)&redirect_uri=\(redirectUri)"
        
        print("🔗 Opening login URL: \(loginUrl)")
        
        if let url = URL(string: loginUrl) {
            DispatchQueue.main.async {
                UIApplication.shared.open(url)
            }
        }
    }
    
    // MARK: - Handle Callback
    
    func handleDeepLink(_ url: URL) {
        guard url.scheme == "ascended" else { return }
        
        // Parse query parameters
        let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
        let queryItems = components?.queryItems ?? []
        
        var code: String?
        var state: String?
        
        for item in queryItems {
            if item.name == "code" {
                code = item.value
            } else if item.name == "state" {
                state = item.value
            }
        }
        
        if let code = code {
            Task {
                await verifyToken(code: code)
            }
        }
    }
    
    // MARK: - Verify Token
    
    func verifyToken(code: String) async {
        guard let url = URL(string: "\(backendURL)/api/mobile-verify") else {
            errorMessage = "Invalid URL"
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["token": code]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                errorMessage = "Token verification failed"
                return
            }
            
            let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
            
            if authResponse.success, let user = authResponse.user {
                // Store token securely
                try? KeychainManager.store(token: code, service: keychainService)
                
                // Update UI
                await MainActor.run {
                    self.user = user
                    self.isAuthenticated = true
                    self.errorMessage = nil
                }
                
                print("✅ User authenticated: \(user.email)")
            } else {
                errorMessage = authResponse.error ?? "Unknown error"
            }
        } catch {
            errorMessage = "Error verifying token: \(error.localizedDescription)"
            print("❌ Verification error: \(error)")
        }
    }
    
    // MARK: - API Requests
    
    func getAuthToken() -> String? {
        try? KeychainManager.retrieve(service: keychainService)
    }
    
    func makeAuthenticatedRequest(
        endpoint: String,
        method: String = "GET",
        body: [String: Any]? = nil
    ) async -> Data? {
        guard let token = getAuthToken() else {
            errorMessage = "No auth token found"
            return nil
        }
        
        guard let url = URL(string: "\(backendURL)/api\(endpoint)") else { return nil }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let body = body {
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else { return nil }
            
            switch httpResponse.statusCode {
            case 200:
                return data
            case 401:
                // Token expired
                await refreshToken()
                // Retry request
                return await makeAuthenticatedRequest(endpoint: endpoint, method: method, body: body)
            default:
                errorMessage = "Request failed: \(httpResponse.statusCode)"
                return nil
            }
        } catch {
            errorMessage = "Network error: \(error.localizedDescription)"
            return nil
        }
    }
    
    // MARK: - Token Refresh
    
    func refreshToken() async {
        guard let token = getAuthToken() else { return }
        guard let url = URL(string: "\(backendURL)/api/auth/refresh") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else { return }
            
            let result = try JSONDecoder().decode(["token": String].self, from: data)
            try? KeychainManager.store(token: result["token"] ?? token, service: keychainService)
            
            print("✅ Token refreshed")
        } catch {
            print("❌ Token refresh failed: \(error)")
        }
    }
    
    // MARK: - Logout
    
    func logout() {
        try? KeychainManager.delete(service: keychainService)
        isAuthenticated = false
        user = nil
    }
}
```

### Step 2: Keychain Manager for Secure Storage

```swift
import Foundation

class KeychainManager {
    static func store(token: String, service: String) throws {
        let data = token.data(using: .utf8)!
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecValueData as String: data
        ]
        
        // Delete existing
        SecItemDelete(query as CFDictionary)
        
        // Add new
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw NSError(domain: "Keychain", code: Int(status))
        }
    }
    
    static func retrieve(service: String) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let token = String(data: data, encoding: .utf8) else {
            throw NSError(domain: "Keychain", code: Int(status))
        }
        
        return token
    }
    
    static func delete(service: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess else {
            throw NSError(domain: "Keychain", code: Int(status))
        }
    }
}
```

### Step 3: Configure Deep Links in SceneDelegate

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, 
               options connectionOptions: UIScene.ConnectionOptions) {
        
        // Handle deep links when opening from URL
        if let urlContext = connectionOptions.urlContexts.first {
            handleDeepLink(urlContext.url)
        }
    }
    
    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
           let url = userActivity.webpageURL {
            handleDeepLink(url)
        }
    }
    
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        for context in URLContexts {
            handleDeepLink(context.url)
        }
    }
    
    private func handleDeepLink(_ url: URL) {
        let authManager = AuthManager()
        authManager.handleDeepLink(url)
    }
}
```

### Step 4: Register URL Scheme in Info.plist

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLScheme</key>
        <string>ascended</string>
        <key>CFBundleURLName</key>
        <string>com.ascended.social</string>
    </dict>
</array>
```

### Step 5: Use in SwiftUI View

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var authManager = AuthManager()
    
    var body: some View {
        Group {
            if authManager.isAuthenticated,
               let user = authManager.user {
                // Authenticated view
                VStack {
                    Text("Welcome, \(user.firstName ?? "User")!")
                    Text(user.email)
                    
                    Button("Logout") {
                        authManager.logout()
                    }
                }
            } else {
                // Login view
                VStack {
                    Text("Ascended Social")
                        .font(.largeTitle)
                    
                    Button("Login with Replit") {
                        Task {
                            await authManager.startLogin()
                        }
                    }
                    .padding()
                    
                    if let error = authManager.errorMessage {
                        Text("Error: \(error)")
                            .foregroundColor(.red)
                    }
                }
            }
        }
        .onOpenURL { url in
            authManager.handleDeepLink(url)
        }
        .task {
            await authManager.loadConfig()
        }
    }
}
```

---

## Part 2: Android Setup (Kotlin)

### Step 1: Add Dependencies to build.gradle

```gradle
dependencies {
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.google.code.gson:gson:2.10.1'
    implementation 'androidx.security:security-crypto:1.1.0-alpha06'
    implementation 'androidx.datastore:datastore-preferences:1.0.0'
}
```

### Step 2: Create AuthManager Class

```kotlin
import android.content.Context
import com.google.gson.JsonParser
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import java.io.IOException

data class MobileConfig(
    val replitClientId: String,
    val backendDomain: String,
    val mobileDevDomain: String,
    val deepLinkScheme: String,
    val apiBaseUrl: String,
    val scopes: List<String>
)

data class User(
    val id: String,
    val email: String,
    val firstName: String?,
    val lastName: String?
)

data class AuthResponse(
    val success: Boolean,
    val user: User?,
    val error: String?
)

class AuthManager(private val context: Context) {
    private val httpClient = OkHttpClient()
    private val backendUrl = "http://localhost:3000"
    private val prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
    
    suspend fun getConfig(): MobileConfig? = try {
        val request = Request.Builder()
            .url("$backendUrl/api/mobile-config")
            .build()
        
        val response = httpClient.newCall(request).execute()
        val body = response.body?.string() ?: return null
        
        // Parse JSON manually
        val json = JsonParser.parseString(body).asJsonObject
        
        MobileConfig(
            replitClientId = json.get("replitClientId").asString,
            backendDomain = json.get("backendDomain").asString,
            mobileDevDomain = json.get("mobileDevDomain").asString,
            deepLinkScheme = json.get("deepLinkScheme").asString,
            apiBaseUrl = json.get("apiBaseUrl").asString,
            scopes = json.getAsJsonArray("scopes").map { it.asString }
        )
    } catch (e: Exception) {
        null
    }
    
    fun startLogin(config: MobileConfig) {
        val platform = "native"
        val redirectUri = "${config.deepLinkScheme}auth/callback"
        val loginUrl = "$backendUrl/api/mobile-login?platform=$platform&redirect_uri=$redirectUri"
        
        val intent = android.content.Intent(
            android.content.Intent.ACTION_VIEW,
            android.net.Uri.parse(loginUrl)
        )
        context.startActivity(intent)
    }
    
    suspend fun verifyToken(code: String): AuthResponse? = try {
        val json = """{"token": "$code"}"""
        val requestBody = json.toRequestBody("application/json".toMediaType())
        
        val request = Request.Builder()
            .url("$backendUrl/api/mobile-verify")
            .post(requestBody)
            .build()
        
        val response = httpClient.newCall(request).execute()
        val body = response.body?.string() ?: return null
        
        // Parse response JSON
        val jsonObj = JsonParser.parseString(body).asJsonObject
        val success = jsonObj.get("success").asBoolean
        
        if (success) {
            val userObj = jsonObj.getAsJsonObject("user")
            val user = User(
                id = userObj.get("id").asString,
                email = userObj.get("email").asString,
                firstName = userObj.get("firstName")?.asString,
                lastName = userObj.get("lastName")?.asString
            )
            storeToken(code)
            return AuthResponse(success = true, user = user, error = null)
        }
        
        AuthResponse(
            success = false,
            user = null,
            error = jsonObj.get("error").asString
        )
    } catch (e: Exception) {
        null
    }
    
    fun storeToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }
    
    fun getToken(): String? = prefs.getString("auth_token", null)
    
    suspend fun makeAuthenticatedRequest(endpoint: String): String? = try {
        val token = getToken() ?: return null
        
        val request = Request.Builder()
            .url("$backendUrl/api$endpoint")
            .header("Authorization", "Bearer $token")
            .build()
        
        val response = httpClient.newCall(request).execute()
        
        when (response.code) {
            200 -> response.body?.string()
            401 -> {
                refreshToken()
                // Retry
                makeAuthenticatedRequest(endpoint)
            }
            else -> null
        }
    } catch (e: IOException) {
        null
    }
    
    suspend fun refreshToken(): Boolean = try {
        val token = getToken() ?: return false
        
        val request = Request.Builder()
            .url("$backendUrl/api/auth/refresh")
            .post(RequestBody.create(null, ""))
            .header("Authorization", "Bearer $token")
            .build()
        
        val response = httpClient.newCall(request).execute()
        val body = response.body?.string() ?: return false
        
        val json = JsonParser.parseString(body).asJsonObject
        val newToken = json.get("token").asString
        
        storeToken(newToken)
        true
    } catch (e: Exception) {
        false
    }
    
    fun logout() {
        prefs.edit().remove("auth_token").apply()
    }
}
```

### Step 3: Deep Link Configuration

```xml
<!-- AndroidManifest.xml -->
<activity
    android:name=".ui.DeepLinkActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="ascended"
            android:host="auth" />
    </intent-filter>
</activity>
```

### Step 4: Handle Deep Link in Activity

```kotlin
class DeepLinkActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val uri = intent.data
        
        if (uri?.scheme == "ascended" && uri.host == "auth") {
            val code = uri.getQueryParameter("code")
            if (code != null) {
                handleAuthCallback(code)
            }
        }
    }
    
    private fun handleAuthCallback(code: String) {
        val authManager = AuthManager(this)
        lifecycleScope.launch {
            val result = authManager.verifyToken(code)
            if (result?.success == true) {
                // Navigate to main app
                startActivity(Intent(this@DeepLinkActivity, MainActivity::class.java))
                finish()
            }
        }
    }
}
```

---

## Part 3: React Native Setup

### Step 1: Create Auth Service

```typescript
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

interface MobileConfig {
    replitClientId: string;
    backendDomain: string;
    deepLinkScheme: string;
    apiBaseUrl: string;
    scopes: string[];
}

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

const BACKEND_URL = 'http://localhost:3000';
const KEYCHAIN_SERVICE = 'com.ascended.social';

export class AuthService {
    config: MobileConfig | null = null;

    async getConfig(): Promise<MobileConfig> {
        const response = await fetch(`${BACKEND_URL}/api/mobile-config`);
        this.config = await response.json();
        return this.config;
    }

    startLogin() {
        if (!this.config) {
            throw new Error('Config not loaded');
        }

        const platform = 'native';
        const redirectUri = `${this.config.deepLinkScheme}auth/callback`;
        const loginUrl = `${BACKEND_URL}/api/mobile-login?platform=${platform}&redirect_uri=${redirectUri}`;

        Linking.openURL(loginUrl);
    }

    async verifyToken(code: string): Promise<AuthResponse> {
        const response = await fetch(`${BACKEND_URL}/api/mobile-verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: code })
        });

        const data = await response.json();

        if (data.success) {
            await SecureStore.setItemAsync(`${KEYCHAIN_SERVICE}:token`, code);
            await SecureStore.setItemAsync(`${KEYCHAIN_SERVICE}:userId`, data.user.id);
        }

        return data;
    }

    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(`${KEYCHAIN_SERVICE}:token`);
    }

    async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const token = await this.getToken();
        if (!token) throw new Error('No auth token');

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${BACKEND_URL}/api${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            await this.refreshToken();
            return this.makeAuthenticatedRequest(endpoint, options);
        }

        return response;
    }

    async refreshToken(): Promise<void> {
        const token = await this.getToken();
        if (!token) throw new Error('No token to refresh');

        const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        await SecureStore.setItemAsync(`${KEYCHAIN_SERVICE}:token`, data.token);
    }

    async logout(): Promise<void> {
        await SecureStore.deleteItemAsync(`${KEYCHAIN_SERVICE}:token`);
        await SecureStore.deleteItemAsync(`${KEYCHAIN_SERVICE}:userId`);
    }
}
```

### Step 2: Set Up Deep Linking

```typescript
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';

const prefix = Linking.createURL('/');

const linking = {
    prefixes: [prefix, 'ascended://'],
    config: {
        screens: {
            AuthCallback: 'auth/callback',
            Home: 'home'
        }
    }
};

export function useDeepLinking(authService: AuthService) {
    const navigation = useNavigation();

    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => {
            const parsed = Linking.parse(url);

            if (parsed.hostname === 'auth' && parsed.pathname === '/callback') {
                const code = (parsed.queryParams?.code as string) || null;
                if (code) {
                    handleAuthCallback(code);
                }
            }
        });

        return () => subscription.remove();
    }, []);

    async function handleAuthCallback(code: string) {
        const result = await authService.verifyToken(code);
        if (result.success) {
            navigation.navigate('Home' as never);
        }
    }
}
```

### Step 3: Login Component

```typescript
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { AuthService } from './AuthService';

const authService = new AuthService();

export function LoginScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        authService.getConfig()
            .then(() => setLoading(false))
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Ascended Social</Text>

            <Button
                title="Login with Replit"
                onPress={() => authService.startLogin()}
            />

            {error && (
                <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>
            )}
        </View>
    );
}
```

---

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Backend running
npm run dev

# 2. Check config endpoint
curl http://localhost:3000/api/mobile-config

# 3. Health check
curl http://localhost:3000/api/mobile-config/health

# 4. Test in mobile app
# - App loads config
# - Click login button
# - Authenticate in Replit
# - App intercepts deep link
# - Token stored securely
# - Can make API requests
```

---

## 🆘 Troubleshooting

**Deep links not working?**
- Check URL scheme is registered
- Re-build app from clean state
- Verify deep link URL format

**Keychain errors on iOS?**
- Check Bundle ID matches Info.plist
- Verify Keychain sharing enabled in capabilities

**Network errors?**
- Verify backend URL is correct
- Check firewall allows connections
- Use `adb logcat` / Xcode to see errors

---

For more details, see [MOBILE_AUTH_COMPLETE_GUIDE.md](./MOBILE_AUTH_COMPLETE_GUIDE.md)
