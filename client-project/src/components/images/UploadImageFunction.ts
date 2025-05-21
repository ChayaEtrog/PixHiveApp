import axios from "axios";
import { uploadImage } from "./imageSlice";
import { AppDispatch } from "../appStore";
import { getUserStatisticsById } from "../user/UserService";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/S3/`;
const API_STAISTICS=import.meta.env.VITE_API_BASE_URL;

export const uploadImageFunction = async ({
  file,
  setUploading,
  setError,
  setAlert,
  fileDetails,
  dispatch
}: {
  file: File | null,
  setUploading: Function,
  setError: Function,
  setAlert: Function,
  fileDetails: {
    UserId: number,
    Name: string,
    FilePath: string,
    FileSize: number,
    Type: string
  },
  dispatch: AppDispatch
}) => {
  if (!file) return;
  try {
    setUploading(true);
    setError(null);

    const id = JSON.parse(sessionStorage.getItem("user") ?? "{}")?.id;
    const data = await getUserStatisticsById(id, API_STAISTICS);
    
    if (data.usedMegabytes + (fileDetails.FileSize/1024/1024) > 20.00) {
      throw {message: "You've reached the limit of the free version"}
    }
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}upload-url`, {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const uploadUrl = response.data.url;

      const uploadResponse = await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      if (uploadResponse.status === 200) {
        const image = {
          userId: fileDetails.UserId ?? 0,
          name: fileDetails.Name,
          FilePath: uploadUrl,
          fileSize: fileDetails.FileSize,
          type: fileDetails.Type,
        };

        const resultAction = await dispatch(uploadImage({ image: image, albumId: -1 }));

        if (uploadImage.fulfilled.match(resultAction)) {
          setAlert("File uploaded successfully!");
        } else {
          const errorMessage = resultAction.payload as string || 'Error saving file information in the database';
          setError(errorMessage);
        }
      } else {
        setError('Error uploading file');
      }
  } catch (err: any) {
    setError('Upload failed: ' + err.message || 'Unknown error');
  } finally {
    setUploading(false);
  }
};

