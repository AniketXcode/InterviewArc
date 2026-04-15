# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Vapi Voice Setup

To run the interview round with the Vapi voice agent, add these env vars in the client app:

```bash
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_ASSISTANT_ID=optional_existing_assistant_id
VITE_VAPI_VOICE_PROVIDER=vapi
VITE_VAPI_VOICE_ID=Elliot
VITE_VAPI_TRANSCRIBER_PROVIDER=deepgram
VITE_VAPI_TRANSCRIBER_MODEL=nova-2
VITE_VAPI_TRANSCRIBER_LANGUAGE=hi
VITE_VAPI_MODEL_PROVIDER=openai
VITE_VAPI_MODEL_NAME=gpt-4.1-mini
VITE_SPEECH_RECOGNITION_LANGUAGE=hi-IN
```

If `VITE_VAPI_ASSISTANT_ID` is omitted, the app starts a lightweight built-in Vapi assistant that stays silent and is used only for premium voice playback plus microphone transcription during the interview.

Use `VITE_VAPI_TRANSCRIBER_LANGUAGE` and `VITE_SPEECH_RECOGNITION_LANGUAGE` to switch the app between Hindi, English, or another supported locale.
