var student = {
    columns: [
        {name:'id', type:'bigint', pk:true, fk:false,null:false, auto_generated:true},
        {name:'first_name', type:'varchar(255)', pk:false, fk:false, null:false, auto_generated:false},
        {name:'last_name', type:'varchar(255)', pk:false, fk:false, null:false, auto_generated:false},
        {name:'email', type:'varchar(255)', pk:false, fk:false, null:false, auto_generated:false},
        {name:'age', type:'smallint', pk:false, fk:false, null: false, auto_generated:false},
        {name:'gender', type:'varchar(255)', pk:false, fk:false, null:true, auto_generated:false},
    ],
    queries: {
        main: "select id as 'key', * from dbo.student",
        insert: "insert into student VALUES('Ron', 'Klod','ron.klod@seebo.com',44,'Male')",
        update: "update table factory.physical set name = 'name 111',lane = 2, stage_id=32, is_global=1 where id=31"
    }
}

module.exports = student;