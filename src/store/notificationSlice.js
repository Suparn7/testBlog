import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '../appwrite/config';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (userId) => {
    const notifications = await service.fetchNotifications(userId);
    return notifications;
});

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addNotification(state, action) {
            // Add notification if it does not already exist (checking ID)
            const notificationId = action.payload.split('|||')[0];
            if (!state.notifications.some(notification => notification.split('|||')[0] === notificationId)) {
                state.notifications.push(action.payload);
            }
        },
        deleteNotification(state, action) {
            const notificationId = action.payload;
            state.notifications = state.notifications.filter(
                (notification) => notification.split('|||')[0] !== notificationId
            );
        },
        clearNotification(state) {
            // Clear all notifications
            state.notifications = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload;  // Replace with fetched notifications
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addNotification, deleteNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
