import { useState } from 'react';
import { SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { useAuth, useApi, useFlag } from '@/shared/hooks';
import { FormInputs, LoginFormInputs, SignupFormInputs } from '@/pages/auth/types';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '@/shared/services/user.service';
import { ResponseError } from '@/shared/types/api.types';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

export type UseAuthFormActionsReturn<TFormValue extends 'login' | 'signup'> = {
    onSubmit: SubmitHandler<FormInputs<TFormValue>>;
    onError: SubmitErrorHandler<FormInputs<TFormValue>>;
    isLoading: boolean;
    error: ResponseError | null;
    setError: React.Dispatch<React.SetStateAction<ResponseError | null>>;
};

export function useAuthFormActions<TFormType extends 'login' | 'signup'>(): UseAuthFormActionsReturn<TFormType> {
    const { setAuth, setRememberMe } = useAuth();
    const { userApi } = useApi();
    const { value: isLoading, setValue: setIsLoading } = useFlag(false);
    const [error, setError] = useState<ResponseError | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (data: LoginFormInputs) => {
        setIsLoading(true);
        const isEmail = data.emailOrUsername.includes('@');

        const loginDetails: LoginRequest = isEmail
            ? { email: data.emailOrUsername, password: data.password }
            : { username: data.emailOrUsername, password: data.password };

        try {
            const loginResult = await userApi.login(loginDetails);
            processLoginResult(loginResult, data.rememberMe);
            navigate(`/profile/${(loginResult as LoginResponse).user.user_id}`);
        } catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                setError(err.response?.data as ResponseError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (data: SignupFormInputs) => {
        setIsLoading(true);

        // Validate password: exactly 5 characters
        if (data.password.length !== 5) {
            setError({ message: 'Password must be exactly 5 characters long.' });
            setIsLoading(false);
            return;
        }

        const signupDetails: SignupRequest = {
            email: data.email,
            username: data.username,
            password: data.password,
            gender: data.gender,
            name_details: data.name_details,
            address: data.address,
        };

        try {
            const signupResult = await userApi.signup(signupDetails);
            processSignupResult(signupResult);
            navigate(`/profile/${(signupResult as SignupResponse).user.user_id}`);
        } catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                setError(err.response?.data as ResponseError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const processLoginResult = (
        result: Awaited<ReturnType<typeof userApi.login>> | undefined,
        rememberMe: boolean
    ) => {
        if (result && 'accessToken' in result) {
            setAuth(result);
            setRememberMe(rememberMe);
        } else {
            setError(result as ResponseError);
        }
    };

    const processSignupResult = (
        result: Awaited<ReturnType<typeof userApi.signup>> | undefined
    ) => {
        if (result && 'accessToken' in result) {
            setAuth(result);
        } else {
            setError(result as ResponseError);
        }
    };

    const onSubmit: SubmitHandler<FormInputs<TFormType>> = async (data) => {
        if ('emailOrUsername' in data && data.emailOrUsername) {
            await handleLogin(data as LoginFormInputs);
        } else {
            await handleSignup(data as SignupFormInputs);
        }
    };

    const onError: SubmitErrorHandler<FormInputs<TFormType>> = (errors) => {
        console.log('Form errors:', errors);
    };

    return { onSubmit, onError, isLoading, error, setError };
}
