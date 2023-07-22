/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomSelect({ id, label, data, value, handleChange, className }) {
  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id={label + '-label'}>{label}</InputLabel>
        <Select
          labelId={label + '-label'}
          id={id}
          value={value}
          onChange={(e) => handleChange({ target: { id, value: e.target.value } })}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          className={className}
        >
          {data.map((d, i) => (
            <MenuItem key={i} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
