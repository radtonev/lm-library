import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { observer } from "mobx-react"
import { observable } from "mobx"
import Book from "../models/Book";

interface IAddNewBookProps {
  show: any;
  toggle: any;
  addBookFunc: any;
}

@observer
class AddNewBook extends React.Component<IAddNewBookProps, any> {

  private error:any = observable({show: false, message: ""});
  private book:Book = observable(new Book(-1, "", "", 0));

  constructor(props:any){
      super(props);

      this.addBook = this.addBook.bind(this);
  }

  private addBook(){
      //Validate input
      this.error.show = false;
      if(!isNaN(this.book.copies) && this.book.copies > 0 && this.book.copies >= 0 && this.book.title.length > 0 && this.book.author.length > 0){
      	this.props.addBookFunc(this.book)
      }else{
      	//Error - invalid input
      	this.error.message = 'Bad input!';
        this.error.show = true;
        setTimeout(()=>{this.error.show = false},2000);
      }
  }

  render(){ 
	return (
    
      <Modal isOpen={this.props.show} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>New Book</ModalHeader>
        <ModalBody>
             {this.error.show ? <Alert color="danger"> {this.error.message} </Alert> : ""} 
             <Form>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input type="text" name="title" id="title" placeholder="100 characters max" onChange={(event)=>{this.book.title = event.target.value;}} />
                </FormGroup>
                <FormGroup>
                  <Label for="author">Author</Label>
                  <Input type="text" name="author" id="author" placeholder="100 characters max" onChange={(event)=>{this.book.author = event.target.value;}} />
                </FormGroup>
                <FormGroup>
                  <Label for="copies">Copies</Label>
                  <Input type="number" min="0" name="copies" id="copies" placeholder="Enter amount of copies available" onChange={(event)=>{this.book.copies = parseInt(event.target.value);}} />
                </FormGroup>
            </Form>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addBook}>Add Book</Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    
  );
}
}



export default AddNewBook;
