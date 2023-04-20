import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';


const EditArticle = ({ article, onUpdate, onClose }) => {
    const [updatedArticle, setUpdatedArticle] = useState(article);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedArticle((prevArticle) => ({ ...prevArticle, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        await onUpdate(updatedArticle);
        setLoading(false);
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>编辑文章</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="标题"
                    type="text"
                    value={updatedArticle.title}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="description"
                    label="描述"
                    type="text"
                    value={updatedArticle.description}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="content"
                    label="内容"
                    type="text"
                    value={updatedArticle.content}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    margin="dense"
                    name="author"
                    label="作者"
                    type="text"
                    value={updatedArticle.author}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="urlToImage"
                    label="图片网址"
                    type="text"
                    value={updatedArticle.urlToImage}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose} disabled={loading}>
                取消
            </Button>
            <Button onClick={handleSave} disabled={loading}>
                保存
            </Button>
            {loading && <CircularProgress size={24} />}
            </DialogActions>
        </Dialog>
    );
};

export default EditArticle;
