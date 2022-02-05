import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import issueBookName from '@salesforce/apex/BookForm.issueBookName';
import issueBookIsbn from '@salesforce/apex/BookForm.issueBookIsbn';
export default class IssueDetailsCmp4 extends LightningElement {
    @track Isbn;
    @track name;
    @track date;
    final;
    bookToIssue;
    handleIsbn(event){
        this.Isbn=event.target.value;
        issueBookIsbn({searchBook:this.Isbn})
        .then(result=>{
            this.bookToIssue=result;
            this.final=result;
            if(this.final){
                alert("No book present.");
            }
        })
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Unabled to Issue',
                    variant: 'error', 
                }),
            );
        });
    }
    handleChange(event){
        this.name=event.target.value;
    }
    handleReturn(event){
        this.date=event.target.value;
    }
    issue(){
        issueBookName({isb:this.Isbn,nameofreader:this.name,issueDate:this.date})
        .then(result =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Created Successfully',
                    variant: 'success',
                }),
            );
        })
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Unabled to Create',
                    variant: 'error',
                }),
            );
        });
    }
}