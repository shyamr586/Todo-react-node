import {Button, List, Typography} from '@mui/material';
import {ListItem} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import TaskPopup from './TaskPopup';
import {v4} from 'uuid';

function App() {
  const [tasks, setTasks] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState({})
  const [selectedOperation, setSelectedOperation] = useState("")

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  useEffect(() => {
    fetchData()
  }, []);

  function fetchData(){
    axios.get('http://localhost:3000/api/todos/')
    .then((response) => {
      const tasksWithOpenFlag = response.data.map((task) => ({ ...task, open: false }));
      setTasks(tasksWithOpenFlag);
    })
    .catch((error) => {
      console.error('Error fetching items:', error);
    });
  }

  function expandHandler(index){
    const updatedTasks = [...tasks];
    updatedTasks[index].open = !updatedTasks[index].open;
    setTasks(updatedTasks);
  }

  function handleCheckboxClick(e,index){
    e.stopPropagation()
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    axios
    .put(`http://localhost:3000/api/todos/${updatedTasks[index].id}`, updatedTasks[index])
    .then((response) => {
      fetchData()
      console.log('Task updated successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error updating task:', error);
  });
  }

  function handleEditFunction(e,index){
    e.stopPropagation()
    setDialogOpen(true)
    setSelectedTask(tasks[index])
    setSelectedOperation("edit")
  }

  function handleDeleteFunction(e,index){
    e.stopPropagation()
    console.log("TASK ID IS: ",tasks[index].id," TITLE IS: ",tasks[index].title)
    axios
    .delete(`http://localhost:3000/api/todos/${tasks[index].id}`)
    .then((response) => {
      fetchData()
      console.log('Task delete successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error deleting task:', error);
    });
  }

  function handleAddFunction(){
    setDialogOpen(true)
    setSelectedOperation("add")
  }

  function handleSubmit(newTask){
    if (selectedOperation === "edit"){
    axios
    .put(`http://localhost:3000/api/todos/${newTask.id}`, newTask)
    .then((response) => {
      fetchData()
      console.log('Task updated successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error updating task:', error);
    });
    } else if (selectedOperation === "add"){
      newTask = {...newTask, "id": v4(), "completed": false, "created":day+"/"+month+"/"+year}
      axios
    .post(`http://localhost:3000/api/todos/`, newTask)
    .then((response) => {
      fetchData()
      console.log('Posted task successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error posting task:', error);
    });
    }
    setSelectedOperation("")
    setSelectedTask("")
  }

  return (
    <Grid container>
      <Grid container xs={12} sx={{marginY: "20px"}}>
        <Grid xs= {10} >
          <Typography variant = "h2">Todo Items</Typography>
        </Grid>
        <Grid xs= {2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="outlined" style={{float: "right"}} onClick={()=>handleAddFunction()}>
          Add Task
        </Button>
        </Grid>
      </Grid>
      <Grid xs={12}>
      {tasks.map((task, i)=>
      (
        <List>
        <ListItemButton onClick = {()=> expandHandler(i)} style={{backgroundColor:"white"}}>
          <Checkbox edge="start" tabIndex={-1} disableRipple checked={task.done} onClick={(e) => {handleCheckboxClick(e,i)}} />
          <ListItemText primary= {task.title} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconButton edge="end" aria-label="edit" onClick={(e) => handleEditFunction(e,i)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteFunction(e,i)}>
              <DeleteIcon />
            </IconButton>
          {task.open ? <ExpandLess /> : <ExpandMore />}
        </div>
        </ListItemButton>
        <Collapse in={task.open} timeout="auto" unmountOnExit>
          <List sx = {{paddingLeft:"35px", margin:"auto", backgroundColor:"white"}}component="div">
          {task.description && (
            <ListItem>
              <ListItemText primary={task.description} />
            </ListItem>
          )}
            <ListItem>
              <ListItemText secondary={"Created date: "+task.created} />
              {task.due && (<ListItemText secondary={"Due date: "+task.due} />)}
            </ListItem>
          </List>
        </Collapse>
      </List>
      )
      )}
      {dialogOpen && (
        <TaskPopup
          open={dialogOpen}
          handleClose={() => {setDialogOpen(false); setSelectedOperation(""); setSelectedTask("")}}
          task={selectedTask}
          operation={selectedOperation}
          handleSubmit={handleSubmit}
        />
      )}
      </Grid>
    </Grid>
  );
}

export default App;
