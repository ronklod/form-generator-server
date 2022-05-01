var classes = {
    columns: [
        {name:'id', type:'bigint', pk:true, fk:false,null:false, auto_generated:true},
        {name:'name', type:'varchar(255)', pk:false, fk:false, null:false,auto_generated:false},
        {name:'content', type:'varchar(255)', pk:false, fk:false, null:false,auto_generated:false},
        {name:'lecture', type:'varchar(255)', pk:false, fk:false, null:false,auto_generated:false},

    ],
    queries: {
        main: "select id as 'key',  * from classes",
        insert: "insert into classes VALUES('Python', 'Learn to program python', 'Prof.python')",
        update: "update table factory.physical set name = 'name 111',lane = 2, stage_id=32, is_global=1 where id=31"
    }
}

module.exports = classes;