import React, { useState } from 'react';
import { UserContext } from '../user/UserReducer';
import { useContext } from "react";
import uploadIcon from '../../../public/Icons/uploadIcon.png'
import { Button } from '@mui/material';
import ErrorMessage from '../ErrorMessage';
import AlertMessage from '../alertMessage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { uploadImageFunction } from './UploadImageFunction';
import './rippleEffect.css'
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/jpg"];
const maxFileSize = 8 * 1024 * 1024;

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
    uploadImageFunction({file,setUploading,setError,setAlert,fileDetails,dispatch})
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgb(86, 86, 86)",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "max-content",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "20px", fontSize: "30px" }}>Upload your image</h3>

          <div className="drag-circle ripple-container" onDrop={handleDrop} onDragOver={handleDragOver}>
            {/* Ripple circles - added here */}
            <div className="ripple-circle ripple-1"></div>
            <div className="ripple-circle ripple-2"></div>
            <div className="ripple-circle ripple-3"></div>

            <div
              style={{
                backgroundImage: `url(${uploadIcon})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "215px",
                height: "215px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "25px", marginTop: "37px" }}>Drag or Drop your image here</p>
              <Button
                variant="outlined"
                component="label"
                style={{
                  color: "rgb(86, 86, 86)",
                  borderColor: "rgb(86, 86, 86)",
                }}
              >
                Choose File
                <input type="file" accept={allowedFileTypes.join(",")} onChange={handleFileChange} hidden />
              </Button>
            </div>
          </div>
        </div>

        {file && (
          <div style={{ marginTop: "20px" }}>
            <p>
              Selected File: <strong>{file.name}</strong>
            </p>
            <Button
              variant="outlined"
              style={{
                color: "rgb(86, 86, 86)",
                borderColor: "rgb(86, 86, 86)",
              }}
              onClick={uploadFile}
              disabled={uploading}
              fullWidth
            >
              {uploading ? "Uploading..." : "Upload"}
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
