export default class AWSUser{
    constructor(user){
        this.state={user:''};
        this.getUser=this.getUser.bind(this);
        if (!AWSUser.instance){
            this.state.user = user;
            AWSUser.instance=this;
        }
        return AWSUser.instance;
    }

    static setInstance(user){
        AWSUser.instance=new AWSUser(user);
    }

    static getInstance(){
        //Returns user instance
        if (!AWSUser.instance)return null;
        return AWSUser.instance;
    }

    getUser(){
        //Returns the username of a user
        return this.state.user.idToken.payload['cognito:username'];
    }
}

