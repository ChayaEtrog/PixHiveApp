import React, { useState } from 'react';
import { UserContext } from '../../user/UserReducer';
import { useContext } from "react";
import uploadIcon from '../../../../public/Icons/uploadIcon.png'
import { Button } from '@mui/material';
import ErrorMessage from '../../ErrorMessage';
import AlertMessage from '../../alertMessage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../appStore';

import './rippleEffect.css'
import { motion } from 'framer-motion';
import { uploadImageFunction } from './UploadImageFunction';
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
    uploadImageFunction({ file, setUploading, setError, setAlert, fileDetails, dispatch })
  };
  const RippleCircle = ({ delay = 0, color = "rgba(200, 200, 200, 0.3)" }) => (
    <motion.div
      initial={{
        width: 260,
        height: 260,
        opacity: 0.5,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        width: 360,
        height: 360,
        opacity: 0,
        x: "-50%",
        y: "-50%",
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeOut",
        delay,
      }}
      style={{
        position: "absolute",
        top: file?"51%":"58%",
        left: "50%",
        borderRadius: "50%",
        backgroundColor: color,
        zIndex: 1,
      }}
    />
  );

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
        <div style={{ width: "max-content", padding: "30px", textAlign: "center" }}>
          <h3 style={{ marginBottom: "40px", fontSize: "30px" }}>Upload your image</h3>

          <div>
            <RippleCircle delay={0} color="rgba(150, 201, 255, 0.24)" />
            <RippleCircle delay={0.8} color="rgba(255, 1, 247, 0.3)" />
            <RippleCircle delay={1.6} color="rgba(145, 21, 173, 0.3)" />
          </div>

          <div
            className="drag-circle"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              margin: "0 auto",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "visible",
              backgroundColor: "#e0e0e0",
              zIndex: 200,
            }}
          >
            <div
              style={{
                backgroundImage: `url(${uploadIcon})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: 215,
                height: 215,
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e0e0e0",
                borderRadius: "50%",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "25px", marginTop: "37px" }}>
                Drag or Drop your image here
              </p>
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
    </div >
  );
};

export default UploadImage;

// <div
//   className="drag-circle"
//   onDrop={handleDrop}
//   onDragOver={handleDragOver}
//   style={{
//     width: 260,
//     height: 260,
//     borderRadius: "50%",
//     margin: "0 auto",
//     cursor: "pointer",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//     overflow: "visible",
//     backgroundColor: "#e0e0e0",
//     zIndex: 200,
//   }}
// >
//   {/* Ripple Effects – מאחורי העיגול */}
//   <div
//     style={{
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       zIndex: 1, // נמוך יותר מהתמונה
//     }}
//   >
//     <RippleCircle delay={0} color="rgba(150, 200, 255, 0.3)" />
//     <RippleCircle delay={0.8} color="rgba(255, 1, 247, 0.78)" />
//     <RippleCircle delay={1.6} color="rgba(145, 21, 173, 0.4)" />
//   </div>

//   {/* Upload Icon Area – קדמי יותר */}
//   <div
//     style={{
//       backgroundImage: `url(${uploadIcon})`,
//       backgroundSize: "contain",
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "center",
//       width: 215,
//       height: 215,
//       position: "relative",
//       zIndex: 2,
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//     }}
//   ></div>