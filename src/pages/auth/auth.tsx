import { Button, Card, PasswordInput, TextInput,  } from '@mantine/core';
import styles from './auth.module.scss';
import { IconAt } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  email: string;
  password: string;
}

export const Auth: React.FC = () => {

  const navigate = useNavigate();

  const {
    register,
    getValues,
    formState: { errors, isValid  },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const { signIn, setUser } = useAuthStore();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    signIn(data.email, data.password).then((res: string) => {
      if (res === 'OK') {
        setUser(true);
        navigate('/products');
      }
    }).finally(() => {
      setLoading(false);
    })
  }


  return (
    <>
      <div className={styles['auth']}>
        <div className={styles['auth__card']}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <h2 className={styles['auth__card-title']}>Auth</h2>
            <TextInput 
              placeholder="Your email" 
              leftSection={<IconAt size={16} />} 
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email',
                },
              })}
              error={!!errors.email?.message}
              required
            />
            <PasswordInput 
              placeholder="Password"
              {...register('password', {
                required: 'Pssword is required',
              })}
              error={!!errors.password?.message}
            />
            <div className={styles['auth__card-buttons']}>
              <Button disabled={!isValid || isLoading} onClick={() => onSubmit(getValues())}>Login</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}