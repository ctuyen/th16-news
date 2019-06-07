var db = require('../utils/db');

module.exports={
    checkCacThu: (email,password)=>{
        var sql =`select * from users where users.email = '${email}' and password = '${password}'`;//   
        return db.load(sql);
        // gido.then(data=>{
        //     var x =data.rows;
        //     console.log(x);
        //     console.log("\n\n\n\n\n\n\n\nday la cai length: "+x.length+"\n\n\n\nn\n");
        //     if(x.length>0) return true
        //     return false
        // }).catch(err=>{console.log(err);return false;})
        
        // var gido = db.load(sql).rows.ahihi;
        // gido.then(a=>{
        //     console.log(a);
        //     if(a>0) return true;
        //     return false
        // }).catch(err=>{
        //     console.log(err);
        //     return false;
        // })        
    }
}