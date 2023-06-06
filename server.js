const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const cors = require("cors");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("todolist","root","Chandravadiya@2003",{
    host: "localhost",
    dialect: "mysql"
});


const app = express();

const todolist = sequelize.define("todolist",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull:false,
    }
})

const taskcompletedlist = sequelize.define("taskcompletedlist",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull:false,
    }
})

app.use(cors());

app.use(bodyparser.json());

app.post("/addtask",async (req,res)=>{
    const name = req.body.taskName;
    const description = req.body.taskDescription;
    await todolist.create({
        name:name,
        description:description
    });
    const remainingTasks = await todolist.findAll();
    res.status(200).json(remainingTasks);
})

app.post("/taskcompletedlist",async (req,res)=>{
    const name = req.body.name;
    const description = req.body.discrp;
    await taskcompletedlist.create({
        name:name,
        description:description
    });
    const completedTasks = await taskcompletedlist.findAll();
    res.status(200).json(completedTasks);
})

app.get("/getremainingtask",async (req,res)=>{
    try {
        const remainingTasks = await todolist.findAll();
        res.status(200).json(remainingTasks);
    } catch(err) {
        console.log("Not Able to Get data: "+err)
    }
})

app.get("/getcompletedtask",async (req,res)=>{
    try {
        const completedTasks = await taskcompletedlist.findAll();
        res.status(200).json(completedTasks);
    } catch(err) {
        console.log("Not Able to Get data: "+err)
    }
})

app.delete("/delettetask/:data_id",async (req,res)=>{
    const id = req.params.data_id;
    await todolist.destroy({where:{id:id}});
})

app.delete("/deletecompletedtask/:data_id",async (req,res)=>{
    const id = req.params.data_id;
    await taskcompletedlist.destroy({where:{id:id}});
})

app.get("/",(req,res,next)=>{
    todolist.sync()
.then(()=>{
    taskcompletedlist.sync()
    .then(()=>{
        res.sendFile(path.join(__dirname,"TaskTrackr.html"));
    });
});
});

app.listen(3000);

