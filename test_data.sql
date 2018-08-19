insert into service_details(max_amount,min_amount,rate,description,max_duration,min_duration,service_name,service_type,user_id)
values(40000,20000,45,"hopefully it will help",8,5,"Capital investissement","investment",9),
(500000,60000,12,"it is mandatory for the project",11,3,"Business Angel","investment",9),
(0,0,50,"give me that!!!",10,4,"Aide au financement","coaching",9),
(0,0,18,"and that!!!",8,2,"Maintenance","operations",9),
(0,0,99,"and also that!!!",7,5,"Logiciels et services IT","advise",9);

insert into step(description,step_num,project_id)
values("step up your idea",0,16),
("study the benchmark",1,16);
insert into step(description,step_num,project_id)
values("precise project definition",2,16),
("have a meet with financial institutions",3,16);

insert into task(task_name,assigned_to,project_step_id)
values("think better about the scope",1,1),
("check if it is OK",1,1),
("check business impact",1,1),
("move to that site",1,1),
("prepare the report",1,1);