import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function TaskPopup({ open, handleClose, task, handleSubmit, operation }) {
  const [newTask, setNewTask] = useState({ ...task });
  const [disabled, setDisabled] = useState(!task.title);

  const handleSave = () => {
    handleSubmit(newTask);
    handleClose();
  };

  const handleFieldChange = (fieldName, value) => {
    setNewTask((prevTask) => ({ ...prevTask, [fieldName]: value }));
    if(fieldName==="title"){
        if (value===""){
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    } 
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{padding:"30px"}}>
      <DialogContent>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Title"
          value={newTask.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />
        <TextField
          label="Description"
          value={newTask.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
        <TextField
          label="Due Date"
          value={newTask.due}
          onChange={(e) => handleFieldChange('due', e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSave} disabled = {disabled}>
          {operation==="edit"?"Save":"Add"}
        </Button>
      </div>
      </DialogContent>
    </Dialog>
  );
}

export default TaskPopup;
