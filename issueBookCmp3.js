import { LightningElement,track,api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import issueBooksForReader from '@salesforce/apex/BookForm.issueBooksForReader';
import fetchReader from '@salesforce/apex/BookForm.fetchReader';
import fatchBookDetails from '@salesforce/apex/BookForm.fatchBookDetails';
export default class IssueBookCmp3 extends LightningElement {
    @track field=[
        {label:'Reader Name', fieldName: 'Name',type:'text'},
        {label:'Aadhar Card Number', fieldName: 'Aadhar_Number__c',type:'number'},
        {label:'Mobile Number', fieldName: 'Mobile_Number__c',type:'number'}
    ];
    @track freeBooks;
    @track freeBooksTrack;
    @track issuedBooks;
    @track item;
    @track readerList=[];
    @track readerSearch;
    @track readerId;
    @api isbn;
    @api bookId1;
    @track comp1;
    @track newBook;
    @track openModel = false;
    @track mode1 = false;
    @track buttonOptions =[
        {label:"Return", value:1},
        {label:"Lost",value:2},
        {label:"Damaged",value:3}
    ];

    findReader(event){
        this.readerSearch = event.detail.value;
        fetchReader({searchReader:this.readerSearch})
        .then(result=>{this.readerList=result;
    })
    }
    selectReader(event){
        this.readerSearch = event.currentTarget.dataset.searchReader;
        this.readerId = event.currentTarget.dataset.row;
    }
    issueBook(){
        this.openModel = true;
    }
    handleCancel(){
        this.openModel = false;
    }
    handleSubmit(){
        issueBooksForReader({readerId: this.readerId,bookId: this.bookId1})
        .then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Issued Successfully',
                    variant: 'success',
                }),
            );
            this.connectedCallback();
            this.openModel = false;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Unabled to Issue',
                    variant: 'error',
                }),
            );
            this.connectedCallback();
            this.openModel = false;
        })
    }

    addBook(){
        this.comp1=true;
    }
    closePopUp(){
        this.comp1=false;
        this.openModel=false;
    }
    newBookCopies(event){
        this.newBook=event.detail.value;
    }
    bCopy(){
        if(this.newBook!=0 && this.newBook!=' '){
            createBookCopies({num:this.newBook,bookId: this.bookId1, bookList:null})
            .then(() =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Successfully added copies',
                        variant: 'success',
                    }),
                );
                this.connectedCallback();
                this.comp1 = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error',
                        variant: 'error',
                    }),
                );
                this.connectedCallback();
                this.comp1 = false;
            })
        }
    }
    connectedCallback(){
        fatchBookDetails({ bookId : this.bookId1 })
            .then(result => {
                this.item = result;               
                if(Object.keys(this.item).length != 0){
                    this.name =  this.item[0]['Book__r']['Name'];
                    this.freeBooks = this.item[0]['Book__r']['Number_of_Free_Books__c'];
                    this.issuedBooks = this.item[0]['Book__r']['Number_of_Issued_Books__c'];
                    this.totalBooks = this.item[0]['Book__r']['Number_of_Available_Books__c'];
                    this.isbn  = this.item[0]['Book__r']['Isbn_Number__c'];
                    this.freeBooksTrack = this.item[0]['Book__r']['Number_of_Free_Books__c'];
                    if(this.freeBooks == 0 || this.freeBooks == undefined){
                        this.mode1 = true;
                    }
                    else{
                            this.mode1 = false;
                    }
                    
                }
                else{
                    fatchBookDetails({isbn : this.isbn})
                    .then(result1 =>{
                        this.name = result1[0]['Name'];
                        this.freeBooks = result1[0]['Number_of_Free_Books__c'];
                        this.issuedBooks = result1[0]['Number_of_Issued_Books__c'];
                        this.totalBooks = result1[0]['Number_of_Available_Books__c'];
                        this.isbn = result1[0]['Isbn_Number__c'];
                        this.freeBooksTrack = result1[0]['Number_of_Free_Books__c'];
                        if(this.freeBooks == 0 || this.freeBooks == undefined){
                            this.mode1 = true;
                        }
                        else{
                                this.mode1 = false;
                        }
                    })
                }               
            })
    }
}