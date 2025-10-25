import { useContext, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { NotificationAPIContext } from '../Provider/context';
import { User } from '@notificationapi/core/dist/interfaces';

interface SlackChannel {
  id: string;
  name: string;
  type: 'channel' | 'user';
}

interface SlackConnectProps {
  description?: string;
  connectButtonText?: string;
  editButtonText?: string;
  disconnectButtonText?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  connectedText?: string;
  selectChannelText?: string;
}

export function SlackConnect({
  description = 'Connect your Slack workspace to receive notifications directly in Slack.',
  connectButtonText = 'Connect Slack',
  editButtonText = 'Edit Channel',
  disconnectButtonText = 'Disconnect',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  connectedText = 'Slack notifications will be sent to:',
  selectChannelText = 'Choose a channel or user to receive notifications:'
}: SlackConnectProps = {}) {
  const context = useContext(NotificationAPIContext);
  const client = context?.getClient();
  const [slackToken, setSlackToken] = useState<
    User['slackToken'] | undefined
  >();
  const [slackChannel, setSlackChannel] = useState<string | undefined>();
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserSlackStatus = useCallback(async () => {
    if (!client) return;

    try {
      setLoading(true);

      // Get user's current slack configuration using user.get
      const user = await client.user.get();

      if (user.slackToken) {
        setSlackToken(user.slackToken);
      }

      if (user.slackChannel) {
        setSlackChannel(user.slackChannel);
      }
    } catch (err) {
      console.error('Error fetching Slack status:', err);
      // If the endpoint doesn't exist yet, that's okay
    } finally {
      setLoading(false);
    }
  }, [client]);

  const loadChannels = useCallback(async () => {
    if (!client || !slackToken) return [];

    try {
      setLoading(true);
      setError(null);

      // Get channels and users from Slack
      const response = await client.slack.getChannels();

      // Combine channels and users into a single array
      const allOptions: SlackChannel[] = [
        ...(response.channels || [])
          .filter((c) => c.id && c.name)
          .map((c) => ({
            id: c.id!,
            name: c.name!,
            type: 'channel' as SlackChannel['type']
          })),
        ...(response.users || [])
          .filter((u) => u.id && u.name)
          .map((u) => ({
            id: u.id!,
            name: u.name!,
            type: 'user' as SlackChannel['type']
          }))
      ];

      setChannels(allOptions);
      return allOptions;
    } catch (err) {
      console.error('Error loading channels and users:', err);
      setError('Failed to load Slack channels and users. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [client, slackToken]);

  useEffect(() => {
    // Fetch the user's current slackToken and slackChannel from the API
    fetchUserSlackStatus();
  }, [fetchUserSlackStatus]);

  useEffect(() => {
    if (slackToken && !slackChannel && !isEditing) {
      loadChannels();
    }
  }, [slackToken, slackChannel, isEditing, loadChannels]);

  const handleConnectSlack = async () => {
    if (!client) return;

    try {
      setLoading(true);
      setError(null);

      // Generate Slack OAuth URL
      const url = await client.slack.getOAuthUrl();

      // Redirect to Slack OAuth
      window.location.href = url;
    } catch (err) {
      console.error('Error connecting to Slack:', err);
      setError('Failed to connect to Slack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChannel = async () => {
    if (!client || !selectedChannel) return;

    try {
      setLoading(true);
      setError(null);

      // Find the selected channel info to get its name and type
      const channelInfo = channels.find((c) => c.id === selectedChannel);
      if (!channelInfo) {
        setError('Channel not found. Please try again.');
        return;
      }

      // Format the channel as #channelname or @username
      const formattedChannel = `${channelInfo.type === 'channel' ? '#' : '@'}${
        channelInfo.name
      }`;

      // Set the selected channel with formatted name
      await client.slack.setChannel(formattedChannel);

      setSlackChannel(formattedChannel);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving channel:', err);
      setError('Failed to save channel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!client) return;

    try {
      setLoading(true);
      setError(null);

      // Remove slackToken and slackChannel using identify
      await client.identify({
        // @ts-expect-error - null is not assignable to type string
        slackToken: null,
        // @ts-expect-error - null is not assignable to type string
        slackChannel: null
      });

      setSlackToken(undefined);
      setSlackChannel(undefined);
      setSelectedChannel('');
      setChannels([]);
      setIsEditing(false);
    } catch (err) {
      console.error('Error disconnecting Slack:', err);
      setError('Failed to disconnect Slack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);

    // Load channels if not already loaded
    let channelsList = channels;
    if (channels.length === 0) {
      channelsList = await loadChannels();
    }

    // Parse the slackChannel to find the matching channel ID
    if (slackChannel) {
      const isChannel = slackChannel.startsWith('#');
      const channelName = slackChannel.substring(1); // Remove # or @
      const channelType = isChannel ? 'channel' : 'user';

      // Find the channel ID that matches the name and type
      const matchingChannel = channelsList.find(
        (c) => c.name === channelName && c.type === channelType
      );

      if (matchingChannel) {
        setSelectedChannel(matchingChannel.id);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedChannel('');
  };

  if (!client) {
    return null;
  }

  // Show loading state
  if (loading && !slackToken && !channels.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  // No Slack token - show connect button
  if (!slackToken) {
    return (
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnectSlack}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : connectButtonText}
          </Button>
        </Stack>
      </Box>
    );
  }

  // Has token but no channel (or editing)
  if (!slackChannel || isEditing) {
    return (
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {selectChannelText}
            </Typography>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="slack-channel-label">Channel or User</InputLabel>
              <Select
                labelId="slack-channel-label"
                value={selectedChannel}
                label="Channel or User"
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                {channels
                  .sort((a, b) => {
                    // Sort channels first, then users
                    if (a.type === b.type) {
                      return a.name.localeCompare(b.name);
                    }
                    return a.type === 'channel' ? -1 : 1;
                  })
                  .map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      {channel.type === 'channel' ? '#' : '@'}
                      {channel.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChannel}
              disabled={!selectedChannel || loading}
            >
              {saveButtonText}
            </Button>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                {cancelButtonText}
              </Button>
            )}
            <Button
              variant="text"
              color="error"
              onClick={handleDisconnect}
              disabled={loading}
              size="small"
            >
              {disconnectButtonText}
            </Button>
          </Stack>
        )}
      </Box>
    );
  }

  // Has both token and channel - show connected state
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {connectedText}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {slackChannel}
      </Typography>
      <Button variant="outlined" onClick={handleEdit} disabled={loading}>
        {editButtonText}
      </Button>
      <Button
        variant="text"
        color="error"
        onClick={handleDisconnect}
        disabled={loading}
      >
        {disconnectButtonText}
      </Button>
    </Stack>
  );
}
