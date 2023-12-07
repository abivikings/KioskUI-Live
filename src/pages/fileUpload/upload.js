// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

const FileUploaderSingle = () => {
  // ** State
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: '.xlsx, .xls',
    onDrop: acceptedFiles => {
      const invalidFiles = acceptedFiles.filter(file => !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls'));

      if (invalidFiles.length > 0) {
        setError('Please upload only Excel files (with .xlsx or .xls extension).');
      } else {
        setError('');
        setFiles(acceptedFiles.map(file => Object.assign(file)));
      }
    },
  });

  const img = files.map(file => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
  ));

  return (
    <Box {...getRootProps({ className: 'dropzone' })} sx={{
      ...(files.length ? { height: 450 } : {}), // Previous styles
      border: '2px dashed lightgray', // Additional style
      padding: '20px', // Additional style
      borderRadius: '5px',
      cursor: 'pointer'
    }}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eaeaea',
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            Drop files here or click to upload.
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{error}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUploaderSingle;
