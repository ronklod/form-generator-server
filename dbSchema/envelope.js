var envelope = {
    columns: [
        {name:'id', type:'bigint', pk:true, fk:false},
        {name:'product_id', type:'int', pk:false, fk:true},
        {name:'name', type:'varchar(100)', pk:false, fk:false},
        {name:'cerated_at', type:'date', pk:false, fk:false},
        {name:'updated_at', type:'date', pk:false, fk:false},
        {name:'is_active', type:'bit', pk:false, fk:false},
        {name:'is_alerts', type:'bit', pk:false, fk:false},
        {name:'is_notifications', type:'int', pk:false, fk:false},
        {name:'email', type:'nvarchar', pk:false, fk:false},
        {name:'sms', type:'nvarchar', pk:false, fk:false},
        {name:'alert_window_size', type:'int', pk:false, fk:false},
        {name:'metrics_problems_ids_filter', type:'varchar(300)', pk:false, fk:false}
    ],
    queries: {
        main: 'select * from platform.envelope',
        insert: 'insert into platform.envelope columns'
    }
}

module.exports = envelope;