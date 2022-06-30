enum Env_var { //enum is for constant named collections
    local_environment = 'local',
    dev_environment   = 'dev',
    prod_environment  = 'prod',
    qa_environment    = 'qa',
}

export default class Environment{

    private environment: String

    constructor(environment: String){
        this.environment = environment;
    }

    getPort(): Number {

        if(this.environment === Env_var.dev_environment){
            return 8080;
        }else if(this.environment === Env_var.prod_environment){
            return 8081;
        }else if(this.environment === Env_var.qa_environment){
            return 8081
        }else{
            return 3000;
        }

    }
}