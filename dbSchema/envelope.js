const fs = require("fs");
var envelope = {
    columns: [
        {name:'id', type:'bigint', pk:true, fk:false, nullable:false},
        {name:'product_id', type:'int', pk:false, fk:true, nullable:false},
        {name:'name', type:'varchar(100)', pk:false, fk:false, nullable:false},
        {name:'cerated_at', type:'date', pk:false, fk:false, nullable:false},
        {name:'updated_at', type:'date', pk:false, fk:false, nullable:false},
        {name:'is_active', type:'bit', pk:false, fk:false, nullable:false},
        {name:'is_alerts', type:'bit', pk:false, fk:false, nullable:false},
        {name:'is_notifications', type:'int', pk:false, fk:false, nullable:false},
        {name:'email', type:'nvarchar', pk:false, fk:false, nullable:true},
        {name:'sms', type:'nvarchar', pk:false, fk:false, nullable:true},
        {name:'alert_window_size', type:'int', pk:false, fk:false, nullable:false},
        {name:'metrics_problems_ids_filter', type:'varchar(300)', pk:false, fk:false, nullable:false}
    ],
    queries: {
        main: 'select * from platform.envelope',
        insert: 'insert into platform.envelope columns'
    }
}

module.exports = envelope;