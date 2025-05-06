import React, { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../user/UserReducer';
import { useContext } from "react";
import uploadIcon from '../../../public/Icons/uploadIcon.png'
import { Button } from '@mui/material';
import ErrorMessage from '../ErrorMessage';
import AlertMessage from '../alertMessage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { uploadImage } from './imageSlice';
import { uploadImageFunction } from './UploadImageFunction';

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/jpg"];
const maxFileSize = 8 * 1024 * 1024; // 10MB

const UploadImage = () => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [fileDetails, setFileDetails] = useState({
    UserId: user.id,
    Name: '',
    FilePath: '',
    FileSize: 0,
    Type: ''
  });

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/S3/`;

  const validateFile = (selectedFile: File) => {
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Only images are allowed.");
      return false;
    }

    if (selectedFile.size > maxFileSize) {
      setError("File size exceeds the limit of 5MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const updateFileDetails = (selectedFile: File) => {
    setFileDetails({
      UserId: user.id,
      Name: selectedFile.name,
      FilePath: '',
      FileSize: selectedFile.size,
      Type: selectedFile.type
    });
  };

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      updateFileDetails(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    // if (!file) return;

    // try {
    //   setUploading(true);
    //   setError(null);

    //   const token = sessionStorage.getItem('authToken');

    //   const response = await axios.get(`${API_BASE_URL}upload-url`, {
    //     params: {
    //       fileName: file.name,
    //       contentType: file.type,
    //     },
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   const uploadUrl = response.data.url;

    //   console.log(file.type);

    //   const uploadResponse = await axios.put(uploadUrl, file, {
    //     headers: {
    //       'Content-Type': file.type,
    //     },
    //   });

    //   if (uploadResponse.status === 200) {

    //     const image = {
    //       userId: fileDetails.UserId ?? 0,
    //       name: fileDetails.Name,
    //       FilePath: uploadUrl,
    //       fileSize: fileDetails.FileSize,
    //       type: fileDetails.Type
    //     };

    //     const resultAction = await dispatch(uploadImage({ image: image, albumId: -1 }));

    //     if (uploadImage.fulfilled.match(resultAction)) {
    //       setAlert("File uploaded successfully!");
    //     } else {
    //       console.log(resultAction);
    //       const errorMessage = resultAction.payload as string || 'Error saving file information in the database';
    //       setError(errorMessage);
    //     }

    //   } else {
    //     setError('Error uploading file');
    //   }
    // } catch (err: any) {
    //   console.log(err);

    //   setError('Upload failed: ' + err.ErrorMessage);
    // } finally {
    //   setUploading(false);
    // }
    uploadImageFunction({file,setUploading,setError,setAlert,fileDetails,dispatch})
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'rgb(86, 86, 86)',
      overflow: 'hidden', 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 'max-content',
          padding: '30px',
          textAlign: 'center',
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '30px' }}>Upload your image</h3>

          <div
            className="drag-circle"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div style={{
              backgroundImage: `url(${uploadIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '215px',
              height: '215px',
            }}>
              <p style={{ fontSize: '18px', marginBottom: '25px', marginTop: '37px' }}>Drag or Drop your image here</p>
              <Button
                variant="outlined"
                component="label"
                style={{
                  color: 'rgb(86, 86, 86)',
                  borderColor: 'rgb(86, 86, 86)',
                }}
              >
                Choose File
                <input
                  type="file"
                  accept={allowedFileTypes.join(",")}
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </div>
          </div>
        </div>

        {file && (
          <div style={{ marginTop: '20px' }}>
            <p>Selected File: <strong>{file.name}</strong></p>
            <Button
              variant="outlined"
              style={{
                color: 'rgb(86, 86, 86)',
                borderColor: 'rgb(86, 86, 86)',
              }}
              onClick={uploadFile}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}
      </div>
      {error && <ErrorMessage message={error} setError={setError}></ErrorMessage>}
      {alert && <AlertMessage message={alert} setMessage={setAlert}></AlertMessage>}
    </div>
  );
};

export default UploadImage;
