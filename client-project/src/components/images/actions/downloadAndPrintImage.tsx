import { AppDispatch } from "../../appStore";
import { getDownloadUrl } from "../imageSlice";

export const DownloadImage = async (fileName: string, dispatch: AppDispatch, setIsDownloading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsDownloading?.(true);

  try {
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
export const PrintImage = async (
  fileName: string,
  dispatch: AppDispatch,
  setIsPrinting?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsPrinting?.(true);
  try {
    const downloadUrl = await dispatch(getDownloadUrl(fileName)).unwrap();
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // יצירת אלמנט דינמי עבור הדפסה
    const printContainer = document.createElement('div');
    printContainer.id = 'print-section';
    printContainer.innerHTML = `
      <style>
        @media screen {
          #print-section { display: none; }
        }
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
          }
          #print-section img {
            max-width: 100%;
            height: auto;
          }
        }
      </style>
      <img src="${imageUrl}" />
    `;

    document.body.appendChild(printContainer);

    // הדפסה ואז ניקוי
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
        URL.revokeObjectURL(imageUrl);
      }, 100);
    }, 100);
  } catch (error) {
    console.error('Error printing the file:', error);
  } finally {
    setIsPrinting?.(false);
  }
};

export const DownloadEditedImage = async (
  imageUrl: string,
  originalFileName: string,
  setIsDownloading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsDownloading?.(true);

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    const fileExtension = originalFileName.split('.').pop() || 'jpg';
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    const editedName = `${baseName}_edited.${fileExtension}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = editedName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading image:', error);
  } finally {
    setIsDownloading?.(false);
  }
};

 
