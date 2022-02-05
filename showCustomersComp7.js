import { LightningElement, track, wire } from 'lwc';
import readerData from '@salesforce/apex/BookForm.readerData';
import {refreshApex} from '@salesforce/apex';
export default class ShowCustomersComp7 extends LightningElement {
    refData;
    @track rData=[];
    @wire(readerData)
    newList(value){
        this.refData=value;
        const { data, error } = value;
        this.rData =[];
        if(data){
            for(var lst in data){
                var reader = {'Id':null,'Name':null,'Issued_Book':null,'Returned':null,'Overdue':null,'bCopy':{}}
                reader.Name = data[lst]['Name'];
                reader.bCopy = data[lst].Issue_Books__r;
                reader.Id = lst;
                let i = 0;
                let r = 0;
                let d = 0;
                for(var j in data[lst].Issue_Books__r){
                    if(data[lst].Issue_Books__r[j].Is_Returned__c){
                        r +=1;
                    }
                    else if(data[lst].Issue_Books__r[j].Is_Returned__c == false){
                        d+=1;
                    }
                }
                i = r + d;
                reader.Issued_Book = i;
                reader.Returned = r;
                reader.Overdue = d;
                this.rData.push(reader); 
            }
        }
        return refreshApex(this.refData);
    }
}