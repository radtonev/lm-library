import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

interface IInformationModalProps{
	show: boolean;
	toggle: any;
	title: string;
	message: string;
}

export default class InformationModal extends React.Component<IInformationModalProps, any> {
  render() {
    return (  	     
      <Modal isOpen={this.props.show} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
        <ModalBody>
        	 <div className="text-break">{this.props.message}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}