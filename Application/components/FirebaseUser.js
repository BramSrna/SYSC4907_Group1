import Firebase from "firebase";
import {Alert} from "react-native";

export default class FirebaseUser{
    constructor(){
        this.auth = Firebase.auth();
        this.user = this.auth.currentUser;
        if(this.user != null) {
            this.name = this.user.displayName;
            this.email = this.user.email;
            this.photoUrl = this.user.photoURL;
            this.emailVerified = this.user.emailVerified;
            this.uid = this.user.uid;
        }
    }

    async register(email, password, displayName){
        this.auth = Firebase.auth();
        await this.auth.createUserWithEmailAndPassword(email, password).then(async function(user){
            if(user != null) {
                await Firebase.auth().currentUser.sendEmailVerification().then(async function(){
                    alert.log("Verification Email Send..");
                    await Firebase.auth().currentUser.updateProfile({
                        displayName: displayName
                    }).catch(function(error){
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode+" "+errorMessage);
                        return false;
                    })
                }).catch(function(error){
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode+" "+errorMessage);
                    return false;
                });
            } else{
                return false;
            }
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/weak-password"){
                alert("The password is too weak!");
            } else {
                console.log("Error(1) " + errorCode + ": " + errorMessage);
            }
            return false;
        });
        return true;
    }

    async requestVerificationEmail(){
        if(Firebase.auth().currentUser != null) {
            await Firebase.auth().currentUser.sendEmailVerification().then(async function(){
                Alert.alert("New Verification Email Send.", "Check your email for the new email.");
            }).catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode+" "+errorMessage);
                return false;
            });
        } else{
            return false;
        }
        return true;
    }

    isUserEmailVerified(){
        return this.emailVerified;
    }

    getDisplayName(){
        return this.displayName;
    }

    getCurrentUser(){
        return this.user;
    }
}