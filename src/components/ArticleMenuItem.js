import React from 'react';
import {
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ArticleMenuItem = React.memo(({ handleClose, handleDelete, article }) => {
    return (
        <MenuItem onClick={() => {
            handleDelete(article);
            handleClose();
        }}>
            <DeleteIcon sx={{ "marginRight": 1, "color": "error.main" }} />
            删除
        </MenuItem>
    );
});

export default ArticleMenuItem;
