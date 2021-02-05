export default class Book {

	private _id : number = -1;
	private _title : string = "";
	private _author : string = "";
	private _copies : number = -1;

	constructor(_id: number, _title : string, _author : string, _copies: number){
		this.id = _id;
		this.title = _title;
		this.author = _author;
		this.copies = _copies;
	}

	get id() : number{
		return this._id;
	}

	get title() : string{
		return this._title;
	}

	get author() : string{
		return this._author;
	}

	get copies() : number{
		return this._copies;
	}

	set id(_id : number){
		this._id = _id;
	}

	set title(_title : string){
		this._title = _title;
	}

	set author(_author : string){
		this._author = _author;
	}

	set copies(_copies : number){
		this._copies = _copies;
	}
}
