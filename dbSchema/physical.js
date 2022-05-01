var physical = {
    columns: [
        {name:'id', type:'bigint', pk:true, fk:false,null:false},
        {name:'name', type:'varchar(100)', pk:false, fk:false, null:true},
        {name:'lane', type:'smallint', pk:false, fk:false, null: true},
        {name:'stage_id', type:'int', pk:false, fk:true, null:false},
        {name:'is_global', type:'bit', pk:false, fk:false, null:false}
    ],
    queries: {
        main: "select id as 'key', * from factory.physical",
        insert: "insert into factory.physical (name, lane, stage_id, is_global) values ('test1', 1,31,0)",
        update: "update table factory.physical set name = 'name 111',lane = 2, stage_id=32, is_global=1 where id=31"
    }
}

module.exports = physical;