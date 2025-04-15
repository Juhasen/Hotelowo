'use client';

import {Paper, InputBase, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {primaryBrown} from "../lib/themeColors";

export default function SearchBar() {
    return (
        <div className="w-full max-w-3xl mx-auto z-20">
            <Paper
                component="form"
                elevation={5}
                sx={{
                    p: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '9999px', // full-rounded
                    width: '100%',
                }}
            >
                <InputBase
                    sx={{ml: 2, flex: 1}}
                    placeholder="Search for hotels, destinations, or experiences"
                    inputProps={{'aria-label': 'search hotels'}}
                />
                <IconButton type="submit" sx={{p: '15px'}} aria-label="search" color="primary">
                    <SearchIcon sx={{ fontSize: 30, color: primaryBrown }} />
                </IconButton>
            </Paper>
        </div>
    );
}
