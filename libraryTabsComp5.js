import { LightningElement,track } from 'lwc';
export default class LibraryTabsComp5 extends LightningElement {
    @track tab = "firstTab";
    @track info=true;
    @track name;
    @track Isbn;
    @track call;
    handleTab(event){
        this.tab = event.target.value;
    }
    handleIssue(event){
        let bookDetail = event.detail;
        this.tab="thirdTab";
        this.name = bookDetail['Name'];
        this.Isbn = bookDetail['Isbn_Number__c'];
        this.call = 1;
        this.thirdTabValues();
    }
    thirdTabValues(){
        setTimeout(()=>{this.template.querySelector("c-issue-details-cmp4").call(this.name,this.Isbn);},500);
    }
    tabInfo(event){
        this.bookInfo=event.detail;
        this.bookId=bookInfo;
        this.info=true;
        this.tab="fifthTab";
    }
    moveTab(){
        if(this.call == 1){
            this.tab = "firstTab";
            setTimeout(()=>{
                this.template.querySelector("c-search-book").justRefresh();},500);
        }
        else if(this.call == 5){
            this.tab= "fifthTab";
            setTimeout(()=>{
                this.template.querySelector("c-issue-book-cmp3").refreshData();},500);
        }
        this.call = 0;
    }
    move(event){
        this.bookInfo=event.detail;
        this.tab="thirdtab";
        this.name = bookDetail['Name'];
        this.Isbn = bookDetail['Isbn_Number__c'];
        this.call = 5;
        this.thirdTabValues();
    }
    
}