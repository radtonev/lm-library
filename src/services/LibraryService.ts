import Web3 from 'web3';
import { LibraryContractConstants } from '../config/Constants';
import Book from '../models/Book';

declare global {
  interface Window {
    ethereum: any;
    web3:any;
  }
}


const getWeb3 = new Promise((resolve, reject) => {
  window.addEventListener("load", async () => {
        //Look for metamask
        if (window.ethereum) {    
           const web3 = new Web3(window.ethereum);  
           try{
             await window.ethereum.enable(); 
             web3.eth.net.getNetworkType().then((networkType:any) => {
             	if(networkType == "ropsten"){
             		resolve(web3);
             	}else{
             		reject({message: "You are currently connected to " + networkType + " network.Please connect to ropsten testnet and refresh the page."});
             	}
             }); 
             
           }catch(error){
             reject(error);
           }
        }else if(window.web3){
          const web3 = window.web3;
          resolve(web3);
        }else{
        	//No network provider
        	reject();
        }

  });
});

export default class LibraryService{

	private web3 : any;
	private libraryContract: any; 

	constructor(){

	}

	public init(){
		return getWeb3.then((web3) => {
				this.web3 = web3;
				//this.web3.eth.handleRevert = true;   //Not working
				
				this.libraryContract = new this.web3.eth.Contract(
					LibraryContractConstants.ABI, 
					LibraryContractConstants.ADDRESS,
					{
						gas: LibraryContractConstants.GAS_LIMIT 
					}
					);
		}, (error) => {
			return Promise.reject(error);
		});
	}


	public getAllBooks() : Promise<any>{
		if(this.web3.eth.accounts.givenProvider.selectedAddress){
			let books : Book[] = [];

			return this.libraryContract.methods.getBooksCount().call({from: this.web3.eth.accounts.givenProvider.selectedAddress})
					.then((count:any) => {	
						let promises = [];
						for(let i = 0; i < count;i++){
							promises.push(
								this.libraryContract.methods.getBookById(i).call({from: this.web3.eth.accounts.givenProvider.selectedAddress})
								.then((book:any) => {
									books.push(new Book(i, book[0], book[1], book[2]));
								})
							);
						}
						return Promise.all(promises).then(() => {
							return books.sort((a:Book,b:Book) => {return (a.id > b.id) ? 1: -1})});
					});
		}else{
			return Promise.reject({message: 'Operation cannot be completed. Please refresh the page.'});
		}
	}

	public addBook(book : Book) : Promise<any>{
		if(this.web3.eth.accounts.givenProvider.selectedAddress){
			return this.libraryContract.methods.addBook(book.title, book.author, book.copies).send({from: this.web3.eth.accounts.givenProvider.selectedAddress});
		}else{
			return Promise.reject({message: 'Operation cannot be completed. Please refresh the page.'});
		}
	}

	public rentBook(_bookId: number) : Promise<any>{
		if(this.web3.eth.accounts.givenProvider.selectedAddress){
			return this.libraryContract.methods.rentBook(_bookId).send({from: this.web3.eth.accounts.givenProvider.selectedAddress});
		}else{
			return Promise.reject({message: 'Operation cannot be completed. Please refresh the page.'});
		}
	}

	public returnBook(_bookId: number) : Promise<any>{
		if(this.web3.eth.accounts.givenProvider.selectedAddress){
			return this.libraryContract.methods.returnBook(_bookId).send({from: this.web3.eth.accounts.givenProvider.selectedAddress});	
		}else{
			return Promise.reject({message: 'Operation cannot be completed. Please refresh the page.'});
		}
	}

	public getBookRentalHistory(_bookId: number) : Promise<any>{
		if(this.web3.eth.accounts.givenProvider.selectedAddress){
			return this.libraryContract.methods.getBookRentalHistory(_bookId).call({from: this.web3.eth.accounts.givenProvider.selectedAddress});
		}else{
			return Promise.reject({message: 'Operation cannot be completed. Please refresh the page.'});
		}
	}


	//Handle error messages, including from smart contract require(...) statement
	public getSmartContractErrorMessage(error:any) : Promise<any>{
		let result= error.toString();
		let transactionHash;

		try{
			result = result.substring(result.indexOf("{"), result.lastIndexOf("}") + 1).replace("\n","");
			transactionHash =  JSON.parse(result).transactionHash;	
		}catch(err){
			//Other error
			console.log(error)
			return Promise.resolve(error.message ? error.message : "Unknown Error");
		}
		return this.web3.eth.getTransaction(transactionHash).then((t:any) => {
			return this.web3.eth.call(t).then((result:any)=>console.log).catch((error:any) => {
				let result= error.toString();
				try{
					result = result.substring(result.indexOf("{"), result.lastIndexOf("}") + 1).replace("\n","");
					let message =  JSON.parse(result).originalError.message.replace("execution reverted: ", "");
					return message;
				}catch(err){
					//Other error
					return Promise.resolve(error.message ? error.message : "Unknown Error");
				}
				
			});
    	});
	}

}

