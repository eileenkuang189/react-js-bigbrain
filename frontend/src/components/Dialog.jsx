import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { YouTube, InsertPhoto } from '@mui/icons-material';
import { Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import MediaPreview from './MediaPreview';

// Popup dialog for users to upload media of type image or youtube video
export default function DialogWrapper (props) {
  const [videoTextField, setVideoTextField] = React.useState('');
  const [updatedMedia, setUpdatedMedia] = React.useState('');

  React.useEffect(() => {
  }, [])

  const handleTagClick = (tag) => {
    console.log(tag, updatedMedia)
    props.onSelectedTagChange(tag);
  };

  // Convert youtube video to embeded URL
  const handleVideoTextField = () => {
    const urlParams = new URLSearchParams(new URL(videoTextField).search);
    const videoId = urlParams.get('v');
    props.onVideoUrlChange(`https://www.youtube.com/embed/${videoId}`);
  };

  const handleClickOpen = () => {
    if (props.selectedTag === 'video' && props.videoUrl !== '') {
      if (props.videoUrl !== '') props.onSelectedTagChange('image');
      setVideoTextField(props.videoUrl);
      props.onImageChange('');
    } else if (props.selectedTag === 'image' && props.image !== '') {
      if (props.videoUrl !== '') props.onSelectedTagChange('video');
      setVideoTextField('');
      props.onVideoUrlChange('');
    }
    props.onOpen(true);
  };

  const handleClear = () => {
    props.onImageChange('');
    props.onVideoUrlChange('');
    props.onSelectedTagChange('');
    setVideoTextField('');
    handleClose();
  };

  const handleClose = () => {
    props.onOpen(false);
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      props.onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    readFile(file);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        aria-label="Button to upload media file, whether it is an image or a video link"
        onClick={handleClickOpen}>
          Upload Media
      </Button>
      <Dialog
        maxWidth='md'
        fullWidth={true}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose media type</DialogContentText>
          <Button onClick={() => handleTagClick('video')} startIcon={<YouTube />} aria-label="Button to select to upload a video link">
            Video URL
          </Button>
          <Button onClick={() => handleTagClick('image')} startIcon={<InsertPhoto aria-label="Button to select to upload a photo from storage"/>}>
            Image
          </Button>
          <Divider sx={{ pt: 2 }} />
          <Box sx={{ pt: 2 }}>
            {props.selectedTag === 'video' && (
              <Stack direction='row' spacing={2}>
                <TextField
                  variant="outlined"
                  defaultValue={videoTextField}
                  label="Enter Video URL"
                  fullWidth
                  onChange={(event) => setVideoTextField(event.target.value)}
                />
                <Button onClick={handleVideoTextField} variant='contained' aria-label="Button to confirm a video link URL">Confirm</Button>
              </Stack>
            )}
            {props.selectedTag === 'image' && (
              <Box>
                <Button variant="contained" component="label" startIcon={<InsertPhoto />} fullWidth aria-label="Button to upload an image">
                  Upload Image
                  <input hidden accept="image/*" type="file" onChange={handleFileUpload} />
                </Button>
              </Box>
            )}
          </Box>
          <MediaPreview
            open={props.open}
            selectedTag={props.selectedTag}
            image={props.image}
            videoUrl={props.videoUrl}
            onUpdatedMedia={(value) => setUpdatedMedia(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear} disabled={!props.selectedTag} variant='outlined' aria-label="Button to remove media and return to the edit question page">Clear</Button>
          <Button onClick={handleClose} variant='contained' aria-label="Button to upload the media">Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
