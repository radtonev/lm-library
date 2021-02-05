import React, {useState} from 'react';
import { observer } from "mobx-react"
import { observable } from "mobx";
import { Table , Navbar, NavbarBrand , NavItem, Button, Alert, Spinner} from 'reactstrap';
import Book from "../models/Book";
import BookUI from './BookUI';
import AddNewBook from './AddNewBook';
import LibraryService from '../services/LibraryService';
import InformationModal from "./common/InformationModal";


@observer
export default class Library extends React.Component {

  //Smart cotract oprations
  private libraryService : LibraryService;

  //State variables
  private web3Loaded = observable({isLoaded: false});
  private appStatus = observable({busy: false});
  private newBookModal = observable({show: false});
  private informationModal = observable({title: "", message: "", show: false});

  private books = observable([new Book(0,"","",0)]);


  constructor(props : any){
    super(props);
    this.libraryService = new LibraryService();
    

    this.toggleNewBookModal = this.toggleNewBookModal.bind(this);
    this.toggleInformationModal = this.toggleInformationModal.bind(this);
    this.addBook = this.addBook.bind(this);
    this.rentBook = this.rentBook.bind(this);
    this.returnBook = this.returnBook.bind(this);
    this.getRentalHistory = this.getRentalHistory.bind(this);
    this.getAllBooks = this.getAllBooks.bind(this);
  }

  componentDidMount(){
      this.libraryService.init()
      .then(() => {
          this.web3Loaded.isLoaded = true;  
          this.getAllBooks();
      })
      .catch((error) => {
          if(error){
		  console.log(error);
		  this.informationModal.title = "Error";
		  this.informationModal.message = error.message;
		  this.informationModal.show = true;
	  }
      });
  }

  private toggleNewBookModal(){
      this.newBookModal.show = !this.newBookModal.show;
	}

  private toggleInformationModal(){
      this.informationModal.show = !this.informationModal.show;
  }	



  private getAllBooks(){
      this.appStatus.busy = true;
      this.libraryService.getAllBooks()
      .then(books => {
         //For web3 version 2.0.0-alpha.1
         // books = books.map((b:any) => {
         //   return new Book(b.id, b.title, b.author, b.copies.toNumber());
         // });
         this.books.replace(books);   
         this.appStatus.busy = false;     
      })
      .catch((error) => {
          if(error){
		  console.log(error);
		  this.informationModal.title = "Error";
		  this.informationModal.message = error.message;
		  this.informationModal.show = true;
	  }
      });
  }

  private addBook(_book: Book){
     this.appStatus.busy = true;
     try{
        this.libraryService.addBook(_book)
        .then((result) => {
            this.getAllBooks();
            this.newBookModal.show = false;
            this.informationModal.title = "New Book";
            this.informationModal.message = "Book added succesfully. Your transaction hash is " + result.transactionHash;
            this.informationModal.show = true;
            this.appStatus.busy = false;
        })
        .catch((error) => {
            this.libraryService.getSmartContractErrorMessage(error).then((message) => {
            this.newBookModal.show = false;
            this.informationModal.title = "Add book";
            this.informationModal.message = message;
            this.informationModal.show = true;
            this.appStatus.busy = false;
          });
        });

    }catch(error){
        //Probably invalid input provided
        this.informationModal.title = "New Book";
        this.informationModal.message = error.message;
        this.informationModal.show = true;
        this.appStatus.busy = false;
    }
  }

  private rentBook(_bookId: number){
      this.appStatus.busy = true;
      this.libraryService.rentBook(_bookId)
      .then((result) => {
          this.getAllBooks();
          this.informationModal.title = "Book Rental";
          this.informationModal.message = "Book rental succesfull. Your transaction hash is " + result.transactionHash;
          this.informationModal.show = true;
          this.appStatus.busy = false;
      })
      .catch((error) => {
          this.libraryService.getSmartContractErrorMessage(error).then((message) => {
              this.informationModal.title = "Book Rental";
              this.informationModal.message = message;
              this.informationModal.show = true;
              this.appStatus.busy = false;
          });

      });
      
  }

  private returnBook(_bookId: number){
     this.appStatus.busy = true;
      this.libraryService.returnBook(_bookId)
      .then((result) => {
          this.getAllBooks();
          this.informationModal.title = "Return book";
          this.informationModal.message = "Book returned succesfully. Your transaction hash is " + result.transactionHash;
          this.informationModal.show = true;
          this.appStatus.busy = false;
      })
      .catch((error:any) => {
          this.libraryService.getSmartContractErrorMessage(error).then((message) => {
              this.informationModal.title = "Return book";
              this.informationModal.message = message;
              this.informationModal.show = true;
              this.appStatus.busy = false;
          });
      });
  }

  private getRentalHistory(_bookId: number) : Promise<any>{
      this.appStatus.busy = true;
      return this.libraryService.getBookRentalHistory(_bookId)
      .then((history) => {
         this.appStatus.busy = false;
         return history;
      })
      .catch((error) => {
          console.log(error)
          this.informationModal.title = "Operation failed";
          this.informationModal.message = error.message;
          this.informationModal.show = true;
          this.appStatus.busy = false;
      });
  }



  render() {
    if(!this.web3Loaded.isLoaded){

      return (
        <>
          <InformationModal 
          {...this.informationModal}
          toggle={this.toggleInformationModal} />
           <Alert color="info">  
            Waiting for web3... Please enable Metamask and connect to ropsten testnet. You might need to refresh the page.
          </Alert>
        </>
      );
    }

    return (
    	<>
          <InformationModal 
          {...this.informationModal}
          toggle={this.toggleInformationModal} />

    	    <Navbar color="light" light expand="md">
            <NavbarBrand>{this.appStatus.busy ? <Spinner color="dark" /> : ""}</NavbarBrand>
          	<NavbarBrand href="/">Library Application</NavbarBrand>
          	<Button color="success" onClick={() => {this.newBookModal.show = true;}}> Add Book </Button>
            <AddNewBook show={this.newBookModal.show} toggle={this.toggleNewBookModal} addBookFunc={this.addBook}/>
          </Navbar>
    	  <Table className="table-dark table-striped">
          <thead>
            <tr>
              <th className="col-md-1">ID</th>
              <th className="col-md-4">Title</th>
              <th className="col-md-3">Author</th>
	            <th className="col-md-2">Available copies</th>
              <th className="col-md-3">Actions</th>
            </tr>
          </thead>

          <tbody>
        			{this.books.map((book:Book) => {
        				return <BookUI  book={book} rentFunc={this.rentBook} returnFunc={this.returnBook} getHistoryFunc={this.getRentalHistory} />}
        			)}		
          </tbody>
        </Table>
         
      </>
    );
  }
}


