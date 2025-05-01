import { createContext, Dispatch } from "react";
import { User } from "../../types/User"


export type Action = {
    type: 'CREATE_USER',
    data: User
} | {
    type: 'UPDATE_USER',
    data: Partial<User>,
} | {
    type: 'DELETE_USER',
}

export const emptyUser: User =
{
  id:0,
  userName: '',
  email: '',
  passwordHash: '',
  phonNumber:''
};

export const UserContext = createContext<{
  user: User;
  userDispatch: Dispatch<Action>;
}>({
  user: emptyUser,
  userDispatch: () => null
});

export default (state: User, action: Action): User => {
    switch (action.type) {
        case 'CREATE_USER':
            return { ...action.data }
        case 'DELETE_USER':
            return emptyUser
        case 'UPDATE_USER':
            return { ...state, ...action.data }

        default:
            return state;
    }
}