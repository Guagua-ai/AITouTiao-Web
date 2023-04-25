import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';

const AddArticle = ({ onAdd, onClose }) => {
  const [newArticle, setNewArticle] = useState({
    sourceId: '',
    sourceName: '',
    author: '',
    displayname: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewArticle((prevArticle) => ({ ...prevArticle, [name]: value }));
  };

  const handleAdd = async () => {
    setLoading(true);
    await onAdd(newArticle);
    setLoading(false);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>添加文章</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="标题"
          type="text"
          value={newArticle.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="description"
          label="描述"
          type="text"
          value={newArticle.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="content"
          label="内容"
          type="text"
          value={newArticle.content}
          onChange={handleChange}
          fullWidth
          multiline
          rows={10}
        />
        <TextField
          margin="dense"
          name="displayname"
          label="作者"
          type="text"
          value={newArticle.displayname}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="author"
          label="作者用户名"
          type="text"
          value={newArticle.author}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="urlToImage"
          label="图片网址"
          type="text"
          value={newArticle.urlToImage}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="url"
          label="来源网址"
          type="text"
          value={newArticle.url}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="sourceId"
          label="来源ID"
          type="text"
          value={newArticle.sourceId}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          name="sourceName"
          label="来源名称"
          type="text"
          value={newArticle.sourceName}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          取消
        </Button>
        <Button onClick={handleAdd} disabled={loading}>
          添加
        </Button>
        {loading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};

export default AddArticle;
