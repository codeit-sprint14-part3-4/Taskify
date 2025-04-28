export type SignupAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
  | { type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' }
  | { type: 'SET_TERMS_ACCEPTED' }
  | { type: 'SET_EMAIL_ERROR'; payload: string }
  | { type: 'SET_NAME_ERROR'; payload: string }
  | { type: 'SET_PASSWORD_ERROR'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD_ERROR'; payload: string }
  | { type: 'SET_MODAL'; payload: { show: boolean; message: string } }
  | {
      type: 'SET_TOAST'
      payload: {
        message: string
        type: 'create' | 'delete' | 'success' | 'info'
      }
    }
  | { type: 'HIDE_TOAST' }
