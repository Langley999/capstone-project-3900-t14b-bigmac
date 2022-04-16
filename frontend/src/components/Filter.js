import React, { useState} from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel, OutlinedInput, Select,
} from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

/**
 * Filter for searching books
 */
const Filter = ({updateSearchRating, updateRating, rating}) => {
  const [openDialog, setOpenDialog] = useState(false);


  const handleChangeSearchRating = (event) => {
    updateRating(event.target.value);
  }

  const handleUpdateSearchRating = () => {
    updateSearchRating(rating);
    setOpenDialog(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    updateRating(0);
    updateSearchRating(0);
  };

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpenDialog}>Filter</Button>
      <Dialog disableEscapeKeyDown open={openDialog} onClose={handleCancel}>
        <DialogTitle>Rating greater or equal than...</DialogTitle>
        <DialogContent>
          <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='demo-dialog-select-label'>Rating</InputLabel>
              <Select
                labelId='demo-dialog-select-label'
                id='demo-dialog-select'
                value={rating}
                onChange={handleChangeSearchRating}
                input={<OutlinedInput label='Rating' />}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleUpdateSearchRating}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Filter;