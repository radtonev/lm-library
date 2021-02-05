import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem} from 'reactstrap';


interface IRentalHistoryProps{
	show: boolean;
	toggle: any;
	rentalHistory: any;
}

export default class RentalHistory extends React.Component<IRentalHistoryProps, any> {
  render() {
    return (
    	     
      <Modal isOpen={this.props.show} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>History</ModalHeader>
        <ModalBody>
        	 <ListGroup type="unstyled">
        	 	{this.props.rentalHistory.map((item:any) => {return <ListGroupItem>{item}</ListGroupItem>})}
			</ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}