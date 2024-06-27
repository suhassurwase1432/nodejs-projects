class APIFeatures {
    constructor(query , queryString){
        this.query = query;
        this.queryString = queryString;
    }
    
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['sort' , 'fields' , 'page' , 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(et|lte|gt|gte|lt)\b/g , match => `$${match}`);
        
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        
        return this;
    }
    fields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        
        return this;
    }
    paginate(){
        if(this.queryString.page || this.queryString.limit){
            const page = this.queryString.page * 1 || 1;
            const limit = this.queryString.limit * 1 || 3;
            const skip = (page -1) * limit;
            
            this.query = this.query.skip(page).limit(limit);  
        }
        
        return this;
    }
} 

module.exports = APIFeatures;