import { Client, Account, Databases, OAuthProvider, ID, Avatars, AppwriteException } from 'react-native-appwrite';
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67fe7662003dae3f9648')
    .setPlatform('com.RootRoutine');

export const database = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databaseId = "68026d4e000908ce7db9";
export const blogsId = "68026d530022ba0f3080";


export async function login() {
    try {
        const redirectUrl = Linking.createURL("/");
        const response = await account.createOAuth2Token(OAuthProvider.Google,redirectUrl);
        if(!response) throw new Error("Create OAuth token failed");
 
        const browserResult = await openAuthSessionAsync(response.toString(),redirectUrl);
        if(browserResult.type !== "success") {
            throw new Error("Create OAuth token failed");
        }
 
        const url = new URL(browserResult.url);
        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();
 
        if(!userId || !secret) throw new Error("Create OAuth token failed");
 
        const session = await account.createSession(userId,secret);
        if(!session) throw new Error("Failed to create session");
       
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
 
export async function getUser() {
    try {
        const result = await account.get();
        if (result) {
            return result;
        }
        return null;
    } catch (error) {
        // When no session exists, Appwrite throws a 401 "missing scopes" error.
        // Treat this as a normal "not logged in" state without logging noise.
        if (error instanceof AppwriteException && error.code === 401) {
            return null;
        }
        console.error(error);
        return null;
    }
}


