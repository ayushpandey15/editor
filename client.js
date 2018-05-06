const socket=io.connect()
const select=window.document.getElementById("select")
const btn=window.document.getElementById("button")
const output=window.document.getElementById("output")
const edd=window.document.getElementById("editor")

btn.addEventListener("click",()=>
{
  socket.emit("compile",{comment:editor.getSession().getValue(),select:select.value})
})
edd.addEventListener("paste",()=>
{
  socket.emit("typing",editor.getSession().getValue())
})

edd.addEventListener("keypress",()=>
{   
  socket.emit("typing",editor.getSession().getValue())
})
select.addEventListener("change",()=>
{
  if(select.value=='Java')
  {
     editor.insert("class test {")
     editor.insert("public static void main()")
     editor.insert("{")
     editor.insert("}")
     editor.insert("}")
     
  }
  socket.emit("changed",select.value)
})
socket.on("compile",(data)=>
{
    output.innerHTML= data
})
socket.on('typing',(data)=>
{  
   editor.getSession().setValue(data)
})
socket.on('changed',(data)=>
{ 
if(data=='Java')
{
   editor.insert("class test {")
   editor.insert("public static void main()")
   editor.insert("{")
   editor.insert("}")
   editor.insert("}")
   
}
select.value=data
})
