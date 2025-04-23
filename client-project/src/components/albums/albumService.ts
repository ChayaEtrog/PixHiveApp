import axios from 'axios';
import { Album, emptyAlbum } from '../../types/Album';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchAlbumById = async (id: number): Promise<Album | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Album/${id}`,{
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching album by ID:', error);
    return null;
  }
};

export const buildBreadcrumbsPath = async (
  album: Album|null,  // האלבום הנוכחי
): Promise<Album[]> => {
  const path: Album[] = [album?album:emptyAlbum];

  let currentParentId = album!.parentId;

  while (currentParentId !== null && currentParentId !== -1) {
    try {
      const parentAlbum =await fetchAlbumById(currentParentId);
      path.unshift(parentAlbum?parentAlbum:emptyAlbum); 
      currentParentId = parentAlbum!.parentId;
    } catch (err) {
      console.error("Failed to fetch parent album", err);
      break;
    }
  }

  return path;
};