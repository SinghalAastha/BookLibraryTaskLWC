import { LightningElement, track,wire} from 'lwc';
import getBooks from '@salesforce/apex/BookForm.getBooks';
import fetchReader from '@salesforce/apex/BookForm.fetchReader';
import retriveBooks from '@salesforce/apex/BookForm.retriveBooks';
import fatchIssueBookDetails from '@salesforce/apex/BookForm.fatchIssueBookDetails';
import { NavigationMixin } from 'lightning/navigation';
export default class SearchBook extends NavigationMixin(LightningElement){
    action=true;
    @track comp;
    @track customFormModal = false; 
    @track item;
    @track isNameClicked;
    @track hideParent=true;
    @track parentIsbn;
    @track searchValue;
    @track searchCriteria='ISBN';
    @track radioValue='ISBN';
    @track placeHolder='Search By '+this.radioValue;
    @track field=[
        {label:'Book Name', fieldName: 'Name',type:'text'},
        {label:'ISBN Number', fieldName: 'ISBN_Number__c',type:'number'},
        {label:'Author', fieldName: 'Author__c',type:'number'},
        {label:'Number_of_Available_Copy', fieldName: 'Number_of_Available_Books__c',type:'number'},
        {label:'Number_of_Issued_Copy', fieldName: 'Number_of_Issued_Books__c',type:'number'}
    ];
    @wire(fatchIssueBookDetails)
    wireBooks({error,data}){
        if(data){
            this.item = data.Id;
        }
    }

    get options() {
        return [
            { label: 'Name', value: 'Name' },
            { label: 'ISBN', value: 'ISBN' },
            { label: 'Author', value: 'Author' },
        ];
    }
    connectedCallback() {
        getBooks({ searchCriteria:this.searchCriteria,
            searchKeyString:this.searchValue
        })
            .then(result => {
                this.item = result;
            })
           
    }
    handleRowAction(event){
        this.isNameClicked =true;
        this.hideParent=false;
        this.parentIsbn=event.detail.row.Isbn_Number__c;
    }
    fetchRecord(event){
        if(event.target.name==='Criteria'){
            this.searchCriteria=event.target.value;
            this.placeHolder='Search Your result By '+event.target.value;
            this.connectedCallback();
        }
    }
    handleChangesearch(event){
        this.searchValue=event.target.value;
        this.connectedCallback();
    }
    openComp3(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:issueBookCmp3",
            attributes:{
                isbn:this.item[0]['Isbn_Number__c'],
                bookId1:this.item[0]['Id']
            }
        }
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes:{
                url: '/one/one.app#'+encodedComponentDef
            }            
        });
    }
}