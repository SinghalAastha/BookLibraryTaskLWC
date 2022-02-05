import { LightningElement,track, wire } from 'lwc';
import issueDet from '@salesforce/apex/BookForm.issueDet';
export default class BookListCmp6 extends LightningElement {
    @wire(issueDet)
    wireData({error,data}){
        this.bdata=data;
    }
    @track bdata=[];
}
