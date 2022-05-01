var student_classes = {
    columns: [
        {name:'student_id', type:'int', pk:true, fk:true,null:false,auto_generated:false},
        {name:'class_id', type:'int', pk:true, fk:true, null:false, auto_generated:false},
        {name:'grade', type:'int', pk:false, fk:false, null:false,auto_generated:false},
    ],
    fk:[
        {name:'class_id', query:'select id from classes'},
        {name:'student_id', query:'select id from studnts'}
    ],
    queries: {
        main: "select concat(student_id , '-', class_id) as 'key', * from student_classes",
        insert: "insert into student_classes values(1,1,98)",
        update: "update table factory.physical set name = 'name 111',lane = 2, stage_id=32, is_global=1 where id=31"
    }
}

module.exports = student_classes;