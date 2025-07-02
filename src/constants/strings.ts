// Constantes de strings para centralizar textos hardcoded
export const STRINGS = {
  // Aria labels
  ARIA_LABELS: {
    BACK: 'Voltar',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    DELETE: 'Excluir',
    EDIT: 'Editar',
    LOGOUT: 'Sair',
    LOGO: 'Logo Ponto PJ',
    BOTTOM_NAVIGATION: 'Menu de navegação inferior',
    EDIT_SESSION: 'Editar registro de ponto',
    DELETE_SESSION: 'Excluir registro de ponto',
    MANUAL_REGISTER: 'Registro manual de ponto',
    CANCEL_EDIT: 'Cancelar edição',
    SAVE_EDIT: 'Salvar edição',
    CANCEL_DELETE: 'Cancelar exclusão',
    CONFIRM_DELETE: 'Confirmar exclusão',
    CANCEL_MANUAL_REGISTER: 'Cancelar registro manual',
    SAVE_MANUAL_REGISTER: 'Salvar registro manual',
  },

  // Placeholder texts
  PLACEHOLDERS: {
    LOGIN_SUBTITLE: 'Digite seus dados para acessar o sistema',
  },

  // Error messages
  ERRORS: {
    SESSION_NOT_FOUND: 'Sessão não encontrada',
    USER_NOT_AUTHENTICATED: 'Usuário não autenticado',
    DATABASE_ERROR: 'Erro de banco de dados',
    NETWORK_ERROR: 'Erro de conexão',
    VALIDATION_ERROR: 'Erro de validação',
  },

  // Status messages
  STATUS: {
    LOADING: 'Carregando...',
    SAVING: 'Salvando...',
    SUCCESS: 'Sucesso',
    ERROR: 'Erro',
  },

  // Time formats
  TIME_FORMATS: {
    DISPLAY: 'HH:mm',
    INPUT: 'HH:mm',
    DATE: 'YYYY-MM-DD',
  },

  // Validation messages
  VALIDATION: {
    REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
    INVALID_EMAIL: 'E-mail inválido',
    INVALID_PASSWORD: 'Senha inválida',
    PASSWORDS_NOT_MATCH: 'As senhas não coincidem',
    INVALID_TIME: 'Horário inválido',
    INVALID_DATE: 'Data inválida',
  },
} as const;

// Tipos para as constantes
export type StringKeys = keyof typeof STRINGS;
export type AriaLabelKeys = keyof typeof STRINGS.ARIA_LABELS;
export type ErrorKeys = keyof typeof STRINGS.ERRORS;
export type StatusKeys = keyof typeof STRINGS.STATUS;
export type ValidationKeys = keyof typeof STRINGS.VALIDATION;
