import axios from "axios";
import { UserPostModal } from "../../types/User";
import { UserStatistics } from "../../types/UserStatistics";

export const loginUser = async (
    email: string,
    password: string,
    API_BASE_URL: string,
    uri: string
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${uri}`, {
            userNameOrEmail: email,
            password: password,
        });
        saveUserSession(response.data.user, response.data.token);

        return response.data; // מחזיר את הנתונים במקרה של הצלחה
    } catch (e: any) {
        throw e.response.data; // זורק שגיאה כדי לטפל בה בקומפוננטה
    }
};

export const registerUser = async (
    email: string,
    password: string,
    userName: string,
    phoneNumber: string,
    API_BASE_URL: string,
    uri: string
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${uri}`, {
            email,
            passwordHash: password,
            userName,
            phoneNumber
        });
        saveUserSession(response.data.user,response.data.token)
        return response.data; // מחזיר את הנתונים לקומפוננטה
    } catch (e: any) {
        throw e.response.data; // זורק את השגיאה לטיפול חיצוני
    }
};


export const saveUserSession = (user: any, token: string) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("authToken", token);
};

export const getUserSession = () => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("authToken");

    return {
        user: user ? JSON.parse(user) : null,
        token: token || null
    };
};

export const updateUser = async (id: number, userData: UserPostModal, API_BASE_URL: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/User/${id}`, userData, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
      });

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error( error.response?.data);
      } else {
        console.error("unexepted error", error);
      }
      throw error;
    }
  };

  export const getUserStatisticsById = async (id: number, API_BASE_URL: string): Promise<UserStatistics> => {
    const response = await axios.get(`${API_BASE_URL}/Statistics/statistics/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
      }
    });
    return response.data;
  };

export const clearUserSession = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
};
