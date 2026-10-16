import { useEffect, useRef, useState } from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 50;

export default function useCodigoOtp() {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((a) => a - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (text, index) => {
    const numeros = text.replace(/\D/g, "");
    const nuevo = [...code];

    if (numeros.length > 1) {
      const digitos = numeros.slice(0, CODE_LENGTH).split("");
      digitos.forEach((d, i) => { nuevo[i] = d; });
      setCode(nuevo);
      inputRefs.current[Math.min(digitos.length, CODE_LENGTH - 1)]?.focus();
      return;
    }

    nuevo[index] = numeros;
    setCode(nuevo);
    if (numeros && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetCode = () => {
    setCode(Array(CODE_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
  };

  return {
    code,
    focusedIndex, setFocusedIndex,
    timer,
    inputRefs,
    handleChange,
    handleKeyPress,
    resetCode,
    CODE_LENGTH,
  };
}
