import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Text, Button, Stack, Alert } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log do erro
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Callback customizado
    this.props.onError?.(error, errorInfo);

    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      // Exemplo: Sentry, LogRocket, etc.
      // captureException(error, { extra: errorInfo })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <Container size='sm' py='xl'>
          <Stack align='center' gap='lg'>
            <Alert
              icon={<IconAlertTriangle size={24} />}
              title='Algo deu errado'
              color='red'
              variant='light'
              className='w-full'
            >
              <Text size='sm' c='dimmed' mb='md'>
                Ocorreu um erro inesperado. Tente recarregar a página ou entre
                em contato com o suporte.
              </Text>

              {import.meta.env.DEV && this.state.error && (
                <details className='mt-4'>
                  <summary className='cursor-pointer text-sm font-medium'>
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className='mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto'>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </Alert>

            <Stack gap='sm' className='w-full'>
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={this.handleRetry}
                variant='filled'
                color='blue'
                fullWidth
              >
                Tentar novamente
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant='outline'
                color='gray'
                fullWidth
              >
                Recarregar página
              </Button>
            </Stack>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
