import { Client, Account, Databases, OAuthProvider, ID, Avatars } from 'react-native-appwrite';
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
        const redirectUrl = Linking.createURL("/"); // construieste url de redirectionare la app
        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUrl); // obtine url de autentificare
        if (!response) throw new Error("Create OAuth token failed");

        // deschide browser catre url-ul OAuth si asteapta redirect inapoi la redirectUrl.
        const browserResult = await openAuthSessionAsync(response.toString(), redirectUrl); 
        if (browserResult.type !== "success") {
            throw new Error("Create OAuth token failed");
        }

        const url = new URL(browserResult.url); // parseaza url-ul de callback (are parametrii din Appwrite).
        const secret = url.searchParams.get("secret")?.toString(); // extrage secret (token temporar Appwrite).
        const userId = url.searchParams.get("userId")?.toString(); // extrage userId

        if (!userId || !secret) throw new Error("Create OAuth token failed");

        // creeaza sesiune in Appwrite folosind userId + secret
        const session = await account.createSession(userId, secret);
        if (!session) throw new Error("Failed to create session");

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getUser() {
    try {
        const result = await account.get(); // api Appwrite: return user-ul curent 
        if (result) {
            return result
        }
        return null;
    } catch (error) {
        return null;
    }
}


