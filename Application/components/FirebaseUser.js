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

    register(email, password, displayName){
        this.auth = Firebase.auth();
        return this.auth.createUserWithEmailAndPassword(email, password).then(() => {
            if(Firebase.auth().currentUser) {
                Firebase.auth().currentUser.sendEmailVerification().then(() => {
                    Alert.alert("Verification Email Send..", "Confirm your email by opening the link that was send to the provided email.");
                    Firebase.auth().currentUser.updateProfile({
                        displayName: displayName
                    }).then(() => {
                        return true;
                    }, (error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode+" "+errorMessage);
                        return false;
                    })
                }, (error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    Alert.alert(errorCode, errorMessage);
                    console.log(errorCode+" "+errorMessage);
                    return false;
                });
            } else{
                return false;
            }
        }, (error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/weak-password"){
                alert("The password is too weak!");
            } else {
                console.log("Error(1) " + errorCode + ": " + errorMessage);
            }
            return false;
        });
    }

    async requestVerificationEmail(){
        if(Firebase.auth().currentUser != null) {
            await Firebase.auth().currentUser.sendEmailVerification().then(async function(){
                Alert.alert("New Verification Email Send.", "Check your email for the new verification email.");
            }).catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(errorCode, errorMessage);
                console.log(errorCode+" "+errorMessage);
                return false;
            });
        } else{
            return false;
        }
        return true;
    }

    isUserEmailVerified(){
        this.reloadUserInfo();
        return this.emailVerified;
    }

    getDisplayName(){
        return this.displayName;
    }

    getCurrentUser(){
        return this.user;
    }

    reloadUserInfo(){
        this.user = Firebase.auth().currentUser.reload();
        if(this.user != null) {
            this.name = this.user.displayName;
            this.email = this.user.email;
            this.photoUrl = this.user.photoURL;
            this.emailVerified = this.user.emailVerified;
            this.uid = this.user.uid;
        }
    }
}