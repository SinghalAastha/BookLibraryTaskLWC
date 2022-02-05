import { LightningElement,track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import retriveBooks from '@salesforce/apex/BookForm.retriveBooks';
import createBookCopies from '@salesforce/apex/BookForm.createBookCopies';
import create from '@salesforce/apex/BookForm.create';
export default class NewBookEntry extends LightningElement {
    @track mode=false;
    @track BookRecordId;
    @track isbnBook=[];
    @track BookName;
    @track AuthorName;
    @track BookPrice;
    @track NumberOfBooks;
    @track searchValue;
    @track mode1=false;
    handleChange(event){
        if(event.target.name==='BookName'){
            this.BookName=event.target.value;
        }
        if(event.target.name==='AuthorName'){
            this.AuthorName=event.target.value;
        }
        if(event.target.name==='BookPrice'){
            this.BookPrice=event.target.value;
        }
        if(event.target.name==='NumberOfBooks'){
            this.NumberOfBooks=event.target.value;
        }
    }
    save(){
        create({BookName:this.BookName,searchValue:this.searchValue,AuthorName:this.AuthorName,BookPrice:this.BookPrice,NumberOfBooks:this.NumberOfBooks})
        .then(result=>{
            this.BookRecordId = result;
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record created successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);    
        })
        .catch(error =>{
           this.error=error.message;
        });
}
connectedCallback() {
    retriveBooks({Isbn:this.searchValue})
    .then(result=>{this.isbnBook=result;
    })
    }
    searchISBN(event){
        this.searchValue = event.target.value; 
        this.connectedCallback();
    }
    handleClick(){
        this.BookName = this.isbnBook[0]['Name'];
        this.searchValue= this.isbnBook[0]['Isbn_Number__c'];
        this.BookPrice = this.isbnBook[0]['Price__c'];
        this.AuthorName = this.isbnBook[0]['Author__c'];
        this.mode = true;
    }

}