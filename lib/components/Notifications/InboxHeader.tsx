import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Divider, IconButton } from '@mui/material';
import { DoneAll, Settings } from '@mui/icons-material';

export type InboxHeaderProps = {
  title?: React.ReactNode;
  button1ClickHandler?: (ids: string[] | 'ALL') => void;
  button2ClickHandler?: () => void;
};

export const InboxHeader = (props: InboxHeaderProps) => {
  const titleComponent = props.title ?? (
    <Typography variant="body1">Notifications</Typography>
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0 12px 0'
        }}
      >
        {titleComponent}

        <div>
          <Tooltip title="Resolve all">
            <IconButton
              size="small"
              onClick={() => {
                props.button1ClickHandler && props.button1ClickHandler('ALL');
              }}
            >
              <DoneAll fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notification Preferences">
            <IconButton size="small" onClick={props.button2ClickHandler}>
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Divider />
    </>
  );
};
