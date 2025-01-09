import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
import { setUserData } from "../store/authSlice"; // Import your action here

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            
            if (userAccount) {
                console.log("inside if of create account");
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser() ::", error);
        }
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout() ::", error);
        }
    }

    async fetchUserById(userId) {
        try {
            const response = await fetch(`${conf.appwriteUrl}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Appwrite-Project': conf.appwriteProjectId,
                    'X-Appwrite-Key': conf.adminApiKey,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
            }
    
            const user = await response.json();
            return user; // Return the user object
        } catch (error) {
            console.error('Error fetching user:', error.message);
            throw error; // Re-throw error for handling in caller
        }
    }

    // Method to update the user's email and name
    async updateUserData(newEmail, newName, password, dispatch) {
        try {
            // Ensure the user is logged in before updating
            const currentUser = await this.account.get();
            if (!currentUser) {
                throw new Error('User is not authenticated');
            }

            // Update the email and name if new values are provided
            if (newEmail) {
                console.log("email start", newEmail, password);
                
                await this.account.updateEmail(newEmail, password);
                console.log("email end");

            }

            if (newName) {
                console.log("name start", newName);

                await this.account.updateName(newName);
            }

            // Fetch the updated user data
            const updatedUser = await this.account.get();

            // Dispatch the updated user data to the Redux store
            dispatch(setUserData(updatedUser));

            console.log("User data updated successfully!");
            return { message: "User data updated successfully!" };
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error; // Re-throw error for handling in caller
        }
    }

    // Corrected method to validate the password by re-authenticating the user
    async validatePassword(email, password) {
        try {
            // First, check if a session exists
            const currentSession = await this.account.getSession('current'); // Get the active session
    
            // If a session exists, log out temporarily to revalidate the password
            if (currentSession) {
                await this.account.deleteSessions(); // Log out the user
            }
    
            // Now attempt to create a new session with the provided credentials
            const session = await this.account.createEmailPasswordSession(email, password);
    
            // If the session is created successfully, the password is correct
            return session ? true : false;
        } catch (error) {
            // If there's an error (either from session deletion or invalid credentials), return false
            console.error("Error validating password:", error);
            return false;
        }
    }
}

// Initialize the AuthService instance
const authService = new AuthService();

export default authService;
