// Modelo externo
const inquirer = require('inquirer');
const chalk = require('chalk');
// Modelo interno
const fs = require('fs');
const{json} = require('stream/consumers');

// funções
operation()
function operation(){
    inquirer.prompt([{
        type:"list",
        name:"action",
        message:"Qual operação bancária você deseja realizar?",
        choices:[
            "Criar Conta",
            "Consultar Saldo",
            "depositar",
            "Sacar",
            "Sair"
        ]
    }])
    .then((answer)=>{
     const action = answer['action']
     if(action === "Criar Conta"){
        createAccount()
       
     }
     else if(action === "Consultar Saldo"){
        getAccountBalance()
     }
     else if(action === "depositar"){
        deposit()
     }
     else if(action === "Sacar"){
        withdraw()
     }
     else if(action === "Sair"){
        console.log(chalk.blue("Obrigado por usar nosso banco"))
        process.exit()
     }
   
    })
    .catch(err => console.log(err))
   
}
// criar uma conta
function createAccount(){
console.log(chalk.bgBlue.white("Bem-vindo(a) ao nosso sistema bancário! Conte conosco para facilitar sua vida financeira."))
console.log(chalk.blue("Escolha as configurações desejadas para sua conta abaixo."))
buildAccount()
}
function buildAccount(){
inquirer.prompt([{
    name:"AccountName",
    message:"Digite um nome para sua conta:"
}])
.then((answer)=>{
const accountName =answer['AccountName']
console.info( accountName)
if(!fs.existsSync("account")){
    fs.mkdirSync("account")
}
fs.writeFileSync(`account/${accountName}.json`,'{"balance":0}',(err)=>console.log(err))
console.log(chalk.green(`Parabéns, sua conta foi criada como ${accountName}`))

})

.catch(err => console.log(err))
}
// adicionar um valor à conta do usuário
function deposit(){
inquirer.prompt([{
    name:"accountName",
    message:"Qual o nome da sua conta?"
}])
.then((answer)=>{
const accountName = answer['accountName']
if(!checkAccount(accountName)){
    return deposit()
}
inquirer.prompt([{
     name:"amount",
        message:"Quanto você deseja depositar?"
}])
.then((answer)=>{
    const amount = answer['amount']
    addAmount(accountName,amount)
    operation()
})
.catch(err => console.log(err))
})
.catch(err =>console.log(err))
}
function checkAccount(accountName){
    if(!fs.existsSync(`account/${accountName}.json`)){
     console.log(chalk.bgRed.black('Esta conta não existe, tente novamente '))
     return false
    }
    return true
}
function getAccount(accountName){
    const accountJson = fs.readFileSync(`account/${accountName}.json`,{
        encoding:'utf8',
        flag:'r'
    });
    return JSON.parse(accountJson)
}
function addAmount(accountName,amount){
    const accountData = getAccount(accountName);
    if(!amount){
       console.log(chalk.bgRed.white("Ocorreu um erro, tente novamente mais tarde "))
       return deposit()
    }
    accountData.balance= parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
       `account/${accountName}.json`,
       JSON.stringify(accountData),
       err => console.log(err)
    )
    console.log(chalk.green(`Foi depositado o valor de  R$${amount} na sua conta`))
}
// Mostrar saldo da conta
function getAccountBalance(){
 inquirer.prompt([{
    name:'accountName',
    message:'Qual o nome da sua conta?'
 }])
 .then((answer)=>{
    const accountName = answer['accountName']
    // Verifique se a conta existe 
    if(!checkAccount(accountName)){
        return getAccountBalance()
    }
    const accountData = getAccount(accountName)
    console.log(chalk.bgBlue.white(`Osaldo da sua conda é R${accountData.balance}`))
    operation()
 })
 .catch(err => console.log(err))
}
// retirar uma quantia da conta do usuário
function  withdraw(){
    inquirer.prompt([{
     name:"accountName",
     message:"Qual o nome da sua conta?"
    }])
    .then((answer)=>{
        const accountName = answer['accountName']
        if (!checkAccount(accountName)){
            return withdraw()
        }
        inquirer.prompt([{
        name:"amount",
        message:"Quanto você deseja sacar?"
        }]).then((answer)=>{
            const amount = answer['amount']
            removeAmount(accountName,amount)
        })
    })
    .catch(err => console.log(err))
}
function removeAmount(accountName,amount){
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.white('Ocorreu um erro, tente novamente mais tarde'))
    }
    if(accountData.balance < amount){
        console.log(chalk.bgRed.white('Valor indisponível!'))
        return withdraw()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(`account/${accountName}.json`,
         JSON.stringify(accountData),
         (err) => console.log(err)
        )
        console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta`))
        operation()
}