import Firebase from "firebase";

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
                    console.log("Verification Email send..");
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


}