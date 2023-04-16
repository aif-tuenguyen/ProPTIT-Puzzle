import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import { User } from 'src/models/user';
import { verify, JWT_SECRET, verifyToken } from 'src/utils/jwt';
import PropTypes from 'prop-types';
import authServices from 'src/services/authServices';
import userServices from 'src/services/userServices';
import useNotify from 'src/hooks/useNotify';
import { clearLocalStorage } from 'src/utils';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isConnectedFacebook: boolean;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  method: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectFacebook: () => void;
  disconnectFacebook: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type ConnectFacebookAction = {
  type: 'CONNECT_FACEBOOK';
};

type DisconnectFacebookAction = {
  type: 'DISCONNECT_FACEBOOK';
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | ConnectFacebookAction
  | DisconnectFacebookAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isConnectedFacebook: false,
  user: null
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('token', accessToken);
  } else {
    localStorage.removeItem('token');
  }
};

const handlers: Record<
  string,
  (state: AuthState, action: Action) => AuthState
> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    isConnectedFacebook: false,
    user: null
  }),
  CONNECT_FACEBOOK: (state: AuthState): AuthState => ({
    ...state,
    isConnectedFacebook: true
  }),
  DISCONNECT_FACEBOOK: (state: AuthState): AuthState => ({
    ...state,
    isConnectedFacebook: false
  })
};

const reducer = (state: AuthState, action: Action): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  connectFacebook: () => Promise.resolve(),
  disconnectFacebook: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem('token');

        if (accessToken && verifyToken(accessToken, JWT_SECRET)) {
          setSession(accessToken);

          const response = await userServices.getInfoMe();
          const user = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authServices.login({ email, password });

    const { token, user } = response.data;

    const accessToken = token?.accessKey;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    clearLocalStorage();
    dispatch({ type: 'LOGOUT' });
  };

  const connectFacebook = async (): Promise<void> => {
    dispatch({ type: 'CONNECT_FACEBOOK' });
  };

  const disconnectFacebook = async (): Promise<void> => {
    dispatch({ type: 'DISCONNECT_FACEBOOK' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        connectFacebook,
        disconnectFacebook
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
