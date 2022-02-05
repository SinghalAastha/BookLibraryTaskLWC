public inherited sharing class BookForm {
    //comp1
    @AuraEnabled
    public static Book__c create(string BookName, string searchValue,string AuthorName, integer BookPrice, integer NumberOfBooks, integer NumberOfIssuedBooks, integer NumberOfFreeBooks){    
        Book__c bookList=new Book__c();
        bookList.Name=BookName;
        bookList.Isbn_Number__c=searchValue;
        bookList.Author__c=AuthorName;
        bookList.Price__c=BookPrice;
        bookList.Number_of_books__c=NumberOfBooks;
        insert bookList;
        return bookList;
    }
    //comp1,comp3
    @AuraEnabled
    public static void createBookCopies(integer num,string bookId,List<Book__c> bookList){
        List<Book_Copy__c> copyList = new List<Book_Copy__c>();
        if(bookId != null && bookId !=''){
            for(integer i=0;i<num;i++){
                Book_Copy__c copy = new Book_Copy__c();
                copy.Book__c = bookId;
                copy.Name = 'Book Copy';
                copyList.add(copy); 
            }
        }
    }
    //comp1,comp2
    @AuraEnabled
    public static list<Book__c> retriveBooks(string Isbn) {
        String bookIsbn = '%' + Isbn + '%';
        list<Book__c> lstBook = [SELECT  Id, Name,Isbn_Number__c,Number_of_Available_Books__c, Author__c, Price__c,Number_of_books__c,Number_of_Issued_Books__c FROM Book__c WHERE Isbn_Number__c LIKE :bookIsbn];
        if(lstBook.size()> 0) {
            return lstBook;
        }
        else {
            return null;
        }
    }
    //comp2
    @AuraEnabled
    public static List<Book__c> getBooks( string searchKeyString){
        String bookDetails=searchKeyString +'%';
        list<Book__c> listOfBook=[SELECT  Id, Name,Isbn_Number__c,Number_of_Available_Books__c, Author__c, Price__c,Number_of_books__c, Number_of_Issued_Books__c FROM Book__c WHERE (Name LIKE :bookDetails)OR (Isbn_Number__c LIKE:bookDetails ) OR(Author__c LIKE:bookDetails ) limit 10];
        if(listOfBook.size()>0){
            return listOfBook;
        }
        else{
            return null;
        }
    }
    //comp2,comp3
    @AuraEnabled(cacheable=true)
    public static List<Reader__c> fetchReader(String searchReader){
        string searchName= searchReader+'%';
        List<Reader__c> readerList =[Select Id, Name,Aadhar_Number__c,Mobile_Number__c FROM Reader__c WHERE Name LIKE:searchName];
        System.debug('Reader List '+readerList);
        return readerList;        
    }
    //comp3
    @AuraEnabled(cacheable=true)
    public static List<Issue__c> fatchBookDetails(string bookId){
        system.debug('bookId '+bookId);
        List<Issue__c> issueList = [Select Id,Charge_of_Issue__c,Issue_From__c,Issue_Till__c, Reader__r.Name, Book_Copy__r.Name,
        Book__r.Name, Book__r.ISBN_Number__c, Book__r.Price__c,Book__r.Number_of_Available_Books__c,Book__r.Number_of_Issued_Books__c
        from Issue__c where Book__r.Id =: bookId];    
        return issueList;
    }
    //comp3
    @AuraEnabled
    public static void issueBooksForReader(string readerId, string bookId){
        List<Book_Copy__c> bookCopy = [Select Id, Name From Book_Copy__c where Book__r.Id =:bookId AND Issued__c =false];
        List<Issue__c> issuedBooks = new List<Issue__c>();
        issuedBooks.add(new Issue__c(Book_Copy__c = bookCopy[0].Id, Reader__c = readerId, Book__c = bookId,Issue_From__c = System.today()));
        if(issuedBooks.size()>0){
            insert issuedBooks;
        }
    }
    //comp4
    @AuraEnabled
    public static Boolean issueBookIsbn(string searchBook){
        List<Book__c> isbnList= [SELECT Id,Name,Isbn_Number__c,Number_of_Available_Books__c FROM Book__c WHERE Isbn_Number__c=: searchBook];
        for(Book__c issueDate : isbnList){
            if(issueDate.Number_of_Available_Books__c>0){
                return false;
            }
            else{
                 return true;
            }
        }
        return false;
    }
    //comp4
    @AuraEnabled
    public static void issueBookName(string isb,string nameofreader, date issueDate){
        List<Book__c> lst= [SELECT Id,Name,Isbn_Number__c FROM Book__c WHERE Isbn_Number__c=: isb];
        Id bId;
        for(Book__c issueB : lst){
            bId=issueB.Id;
        }
        Reader__c readerName = new Reader__c(Name=nameofreader,Book__c=bId,Return__c=issueDate,Issued_Date__c=date.today());
      insert readerName;
    }
    //comp7
    @AuraEnabled(cacheable=true)
    public static List<Reader__c> readerData(){
		List<Reader__c> readerList = [Select Id, Name, 
                                     (Select Id, Is_Returned__c,Book_Copy__r.Name From Issue_Books__r )
                                     from Reader__c];     
        List<Reader__c> reader = new List<Reader__c>();
        for(Reader__c read: readerList){
            if(read.Issue_Books__r.size() > 0){
                reader.add(read);
            }
        }
        return reader;
    }
    //comp6
    @AuraEnabled(cacheable=true)
    public static List<Issue__c> issueDet(){
        List<Issue__c> i= [Select Id,Issue_From__c,Issue_Till__c,Is_Returned__c, Reader__r.Name, Book_Copy__r.Name,
        Book__r.Name, Book__r.ISBN_Number__c from Issue__c];
        return i;
    }
}