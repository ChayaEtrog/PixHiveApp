import { AppDispatch } from "../appStore";
import { getDownloadUrl } from "../images/imageSlice";

export const DownloadImage = async (fileName: string, dispatch: AppDispatch, setIsDownloading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsDownloading?.(true);
  try {
    // Dispatch the getDownloadUrl action
    const downloadUrl = await dispatch(getDownloadUrl(fileName)).unwrap();
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // שם הקובץ שנשמור
      link.click();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
  } finally {
    setIsDownloading?.(false);
  }
};

// const handleDownloadClick = async () => {
//   let fileUrl = drawing.imageUrl, fileName = drawing.name
//   try {
//     const response = await fetch(fileUrl);
//     if (!response.ok) {
//       throw new Error('Failed to fetch file');
//     }
//     const blob = await response.blob();
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName; // שם הקובץ שנשמור
//     link.click();
//   } catch (error) {
//     console.error('Error downloading the file:', error);
//   }
// };