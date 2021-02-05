import React from 'react';
import {ButtonGroup, Button} from 'reactstrap';
import RentalHistory from './RentalHistory';
import { observer } from "mobx-react"
import { observable } from "mobx"

interface IButtonActionsProps{
	book: any;
  rentFunc: any,
  returnFunc: any,
  getHistoryFunc: any
}


@observer
export default class BookActions extends React.Component<IButtonActionsProps, any> {

  private rentalHistoryModal = observable({show: false});
  private rentalHistory = observable([]);

  constructor(props:any){
  	super(props);
  	this.toggleRentalHistoryModal = this.toggleRentalHistoryModal.bind(this);
    this.showHistory = this.showHistory.bind(this);
  }

  private toggleRentalHistoryModal(){
      this.rentalHistoryModal.show = !this.rentalHistoryModal.show;
  }

  private showHistory(){
      this.props.getHistoryFunc(this.props.book.id).then((history:any) => {
          this.rentalHistory.replace(history);
          this.rentalHistoryModal.show = true;
      });

  }

  render() {
    return (
    	<>
    	 <ButtonGroup className="d-flex justify-content-center">
      		<Button color="danger" onClick={() => {this.props.rentFunc(this.props.book.id)}}>Rent</Button>
      		<Button color="primary" onClick={() => {this.props.returnFunc(this.props.book.id)}}>Return</Button>
      		<Button color="secondary" onClick={this.showHistory}>Rental History</Button>
    	 </ButtonGroup>
    	 <RentalHistory show={this.rentalHistoryModal.show} toggle={this.toggleRentalHistoryModal} rentalHistory={this.rentalHistory} />
    	 </>
    );
  }
}

