import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../user/UserReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { uploadImage } from './imageSlice';
import uploadIcon from '../../../public/Icons/uploadIcon.png';
import ErrorMessage from '../ErrorMessage';
import AlertMessage from '../alertMessage';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router';

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/jpg"];
const maxFileSize = 10 * 1024 * 1024; // 10MB

const UploadImagePopup = ({ onClose }: { onClose: Function }) => {
    const { albumId } = useParams();  // קריאת ה-id מה-URL
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
            setError("File size exceeds the limit of 10MB.");
            return false;
        }
        setError(null);
        return true;
    };

    const handleFileSelect = (selectedFile: File) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            setFileDetails({
                UserId: user.id,
                Name: selectedFile.name,
                FilePath: '',
                FileSize: selectedFile.size,
                Type: selectedFile.type
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const uploadFile = async () => {
        if (!file) return;
        try {
            setUploading(true);
            setError(null);
            const token = sessionStorage.getItem('authToken');

            const response = await axios.get(`${API_BASE_URL}upload-url`, {
                params: { fileName: file.name, contentType: file.type },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const uploadUrl = response.data.url;

            const uploadResponse = await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
            });

            if (uploadResponse.status === 200) {
                const image = {
                    userId: fileDetails.UserId,
                    name: fileDetails.Name,
                    FilePath: uploadUrl,
                    fileSize: fileDetails.FileSize,
                    type: fileDetails.Type
                };

                const resultAction = await dispatch(uploadImage({ image, albumId: albumId ? Number(albumId) : -1 }));
                if (uploadImage.fulfilled.match(resultAction)) {
                    setAlert("File uploaded successfully!");
                    onClose(false);
                } else {
                    const errorMessage = resultAction.payload as string || 'Error saving file in the database';
                    setError(errorMessage);
                }
            } else {
                setError('Error uploading file');
            }
        } catch (err: any) {
            setError('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.26)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }} onClick={() => onClose(false)}>
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '10px',
                    width: '400px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <IconButton onClick={() => onClose(false)} style={{ color: 'red', position: 'absolute', right: 10, top: 10 }}>
                    <CloseIcon />
                </IconButton>

                <h3 style={{ marginBottom: '20px', fontSize: '30px', textAlign: 'center' }}>Upload your image</h3>

                {/* אזור הגרירה עם אנימציה */}
                <div
                    className="drag-circle"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',  // לאפשר מיקום של הכיתוב וכפתור בתוך
                    }}
                >
                    <div style={{
                        backgroundImage: `url(${uploadIcon})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '150px',
                        height: '150px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <p style={{
                            fontSize: '16px',
                            marginBottom: '25px',
                            marginTop: '30px',
                            textAlign: 'center',
                        }}>Drag or Drop your image here</p>
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

                {file && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p>Selected File: <strong>{file.name}</strong></p>
                        <Button
                            variant="outlined"
                            style={{
                                color: 'rgb(86, 86, 86)',
                                borderColor: 'rgb(86, 86, 86)',
                                width: '300px',
                            }}
                            onClick={uploadFile}
                            disabled={uploading}
                            fullWidth
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                )}

                {error && <ErrorMessage message={error} setError={setError} />}
                {alert && <AlertMessage message={alert} setMessage={setAlert} />}
            </div>
        </div>
    );
}

export default UploadImagePopup;
