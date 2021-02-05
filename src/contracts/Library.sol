pragma solidity >= 0.7.0 < 0.8.0;

contract LibraryContract{
    
    uint constant private MAX_TEXT_CHARACTERS = 100;
    address private owner;
    
    constructor(){
        owner = msg.sender;
    }
    
    modifier onlyAdmin{
        require(msg.sender == owner, 'Only Admin has privilages');
        _;
    }
    
    modifier validId(uint _id){
        //Valid id
        require(_id < books.length, "Book with this id does not exist");
        _;
    }
    
    
    //Additional book information can be referenced from external database. 
    //Only author and title will be stored in the blockchain.
    struct Book{
        string title;
        string author;
    }
    
    
    Book[] private books; //Array index is used as book identifer
    
    mapping(address => mapping(uint => bool)) private rentedBooks;
    mapping(uint => uint) private availableCopies;
    mapping(uint => address[]) private bookRentalHistory;
    
    function addBook(string memory _title, string memory _author, uint _copies) external onlyAdmin returns(uint){
        //Validate max title characters and copies. Does not support UTF8 strings.
        require(bytes(_title).length <= MAX_TEXT_CHARACTERS, "Max characters exceeded");
        require(bytes(_author).length <= MAX_TEXT_CHARACTERS, "Max characters exceeded");
        require(_copies >= 0, "Available copies cannot be negative number");
  
        uint newId = books.length;
        books.push(Book(_title,_author));
        availableCopies[newId] = _copies;
        return newId;
    }
    
    function getBooksCount() external view returns(uint){
        return books.length;
    }
    
    function getBookById(uint _id) external view validId(_id) returns(string memory, string memory, uint){
        return (books[_id].title, books[_id].author, availableCopies[_id]);
    }
    
    function getBookRentalHistory(uint _id) external view validId(_id) returns(address[] memory){
        return bookRentalHistory[_id];
    }
    
    
    function rentBook(uint _id) external validId(_id){
        address clientAddress = msg.sender;
        
        //Check for available copies
        require(availableCopies[_id] > 0,"No copies available");
        //Check if a copy is already rented
        require(rentedBooks[clientAddress][_id] == false, "Book already rented");
        
        rentedBooks[clientAddress][_id] = true;
        availableCopies[_id]--;
        bookRentalHistory[_id].push(clientAddress);
    }
    
    function returnBook(uint _id) external validId(_id){
        address clientAddress = msg.sender;
        
        //Check if the book is actualy rented
        require(rentedBooks[clientAddress][_id] == true, "This book is not rented by you or you have already returned it");
        
        rentedBooks[clientAddress][_id] = false;
        availableCopies[_id]++;
    }
    
}

