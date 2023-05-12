import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function MediaPreview (props) {
  const { selectedTag, image, videoUrl, open } = props;
  const [newPreview, setNewPreview] = React.useState('');

  React.useEffect(() => {
    setNewPreview(createPreview());
  }, [selectedTag, image, videoUrl, open]);

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  // Create a preview of the uploaded image or video URL
  const createPreview = () => {
    if (selectedTag === 'video' && videoUrl !== '') {
      const updates = (
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            height: '40%',
            paddingBottom: '50%',
          }}
        >
          <iframe
            title="YouTube Preview"
            src={videoUrl}
            alt='quiz video'
            style={iframeStyle}
          />
        </Box>
      )
      return updates;
    }
    if (selectedTag === 'image' && image !== '') {
      const updates = (
        <Box component="img" src={image} sx={{ maxHeight: '30vw' }} alt='quiz image'></Box>
      )
      return updates;
    }
    return (
      <Typography variant='body2'>No preview available</Typography>
    );
  }
  return (
    <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
      {newPreview}
    </Box>
  )
}
