import React from 'react';
import BookActions from "./BookActions"
import Book from '../models/Book'

interface IBookUIProps{
	book: Book;
  rentFunc: any,
  returnFunc: any,
  getHistoryFunc: any
}

class BookUI extends React.Component<IBookUIProps, any> {
  render() {
    return (
    	 <tr>
          <th scope="row">{this.props.book.id}</th>
          <td>{this.props.book.title}</td>
          <td>{this.props.book.author}</td>
	        <td>{this.props.book.copies}</td>
          <td><BookActions {...this.props}/></td>
        </tr>	

    );
  }
}

export default BookUI;
