import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Table,
    TableContainer,
    TableHead,
    TextField,
    Paper,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { fetchUsers, updateUser, deleteUser, promoteUser, demoteUser } from '../services/users';
import { refreshAccessToken, validateAccessToken, handleLogout } from '../services/auth';
import { roleToChinese } from '../utils/i18n';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    const handleClickOpen = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await deleteUser(selectedUser.id);
        loadUsers();
        setOpen(false);
    };

    const handleEdit = (user) => {
        setEditedUser(user);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditSubmit = async () => {
        await updateUser(editedUser);
        loadUsers();
        setEditOpen(false);
    };

    const handlePromote = async (user) => {
        await promoteUser(user.id);
        loadUsers();
    };

    const handleDemote = async (user) => {
        await demoteUser(user);
        loadUsers();
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!localStorage.getItem('accessToken')) {
                window.location.href = '/login';
                return;
            }
            try {
                const response = await validateAccessToken();
                if (response.status !== 200) {
                    window.location.href = '/login';
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Access token expired, try to refresh it
                    const tokenRefreshed = await handleTokenExpiration();
                    if (!tokenRefreshed) {
                        window.location.href = '/login';
                    }
                } else {
                    console.error('Failed to validate token:', error);
                    window.location.href = '/login';
                }
            }
        };

        validateToken();
        const userInfo = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            profileImage: localStorage.getItem('profileImage'),
        };
        setUser(userInfo);
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
    };

    const handleTokenExpiration = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await refreshAccessToken(refreshToken);

        if (refreshResponse.status === 200) {
            // Access token refreshed successfully, store the new token
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
            return true;
        } else {
            // Refresh token expired or failed, remove tokens and redirect the user to the login page
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return false;
        }
    };

    return (
        <>
            {/* Add the edit user dialog */}
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-dialog-title"
            >
                <DialogTitle id="edit-dialog-title">编辑用户</DialogTitle>
                <DialogContent>
                    <TextField
                        label="姓名"
                        value={editedUser.name || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="电子邮件"
                        value={editedUser.email || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="电话"
                        value={editedUser.phone || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="角色"
                        value={editedUser.role || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="头像"
                        value={editedUser.profile_image || ''}
                        onChange={(e) =>
                            setEditedUser({ ...editedUser, profileImage: e.target.value })
                        }
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add the delete user dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">删除用户</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        确定要删除此用户吗？此操作无法撤销。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add the navigation bar */}
            <Navbar user={user} handleLogout={handleLogout} />

            {/* Add the user management page content */}
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ marginTop: 4 }}>
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    color: '#FFFFFF', // Change the color to your preferred color
                                }}
                            >
                                用户管理
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>姓名</TableCell>
                                        <TableCell>电子邮件</TableCell>
                                        <TableCell>电话</TableCell>
                                        <TableCell>头像</TableCell>
                                        <TableCell>角色</TableCell>
                                        <TableCell>操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={user.profile_image}
                                                    alt="Profile"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            </TableCell>
                                            <TableCell>{roleToChinese(user.role)}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(user)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleClickOpen(user)}>
                                                    <Delete />
                                                </IconButton>
                                                <IconButton onClick={() => handlePromote(user)}>
                                                    <ArrowUpward />
                                                </IconButton>
                                                <IconButton onClick={() => handleDemote(user)}>
                                                    <ArrowDownward />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default UserManagement;
