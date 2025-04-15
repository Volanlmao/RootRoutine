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
        if(result) {
            return result
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
// export async function seedBooks() {
//     try {
//         for (const book of newArrivals) {
//             await database.createDocument(databaseId, booksCollection, ID.unique() ,book);
//         }
//         console.log("Books seeded successfully");
//     } catch (error) {
//         console.log(error);
//     }
// }

