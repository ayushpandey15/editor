const express=require('express')
const socket=require('socket.io')
const cp=require('child_process')
const fs=require('fs')
const app=express()
const PORT=process.env.PORT || 3000
const server=app.listen(PORT,()=>
{
    console.log(`the port is listening at ${PORT}`)
})
app.use(express.static(__dirname))
// connnenction and processing
const io=socket(server)
io.on('connection',(socket)=>
{   socket.on("compile",(data)=>
{     let input_data=data.comment
        if (data.select=='Java')
     { 
         //console.log("inside java")
         
     fs.writeFileSync("./test.java",input_data,'utf8',(err)=>
    {
        if(err) throw err
    })
cp.spawnSync("javac",['./test.java'])
const proc=cp.spawn("java",['test'])
proc.stdout.setEncoding('utf8')
proc.stdout.on("data",(data)=>
{ 
    console.log("the data is "+data)
io.sockets.emit("compile",data)
})
proc.stderr.on("data",(err)=>
{
  io.sockets.emit("compile",err)
})
 }
  else if(data.select=="C++")
  {
      fs.writeFileSync("./test.cpp",input_data,'utf8',(err)=>
    {
        if(err) throw err
    })
    cp.spawnSync("g++",['./test.cpp'])
    const proc=cp.spawn("./a.out")
    proc.stdout.setEncoding('utf8')
    proc.stdout.on("data",(data)=>
{
    io.sockets.emit("compile",data)   
})
proc.stderr.on("data",(err)=>
{
    io.sockets.emit("compile",err)
})
  }
  else if(data.select=='Javascript')
  {
      fs.writeFileSync("./test.js",input_data  ,'utf8',(err)=>
    {
        if(err) throw err
    })
    const proc=cp.spawn("node",['./test.js'])
     proc.stdout.setEncoding('utf8')
    proc.stdout.on("data",(data)=>
{
    io.sockets.emit("compile",data)   
})
proc.stderr.on("data",(err)=>
{
    io.sockets.emit("compile",err)
})
  }
  else if(data.select=="C")
  {
    fs.writeFileSync("./test.c",input_data,'utf8',(err)=>
    {
        if(err) throw err
    })
    cp.spawnSync("gcc",['./test.c'])
    const proc=cp.spawn("./a.out")
    proc.stdout.setEncoding('utf8')
    proc.stdout.on("data",(data)=>
{
    io.sockets.emit("compile",data)   
})
proc.stderr.on("data",(err)=>
{
    io.sockets.emit("compile",err)
})
  }
})

socket.on('typing',(data)=>
 {  
     socket.broadcast.emit("typing",data)
  
})
socket.on('changed',(data)=>
{   socket.broadcast.emit('changed',data)
})

})
