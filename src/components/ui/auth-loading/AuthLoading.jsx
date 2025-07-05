"use client";
import { useLottie } from "lottie-react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import animationData from "./animation-data.json"; // Adjust the path as necessary
import "./auth-loading.css";

export const dynamic = "force-dynamic"; // This is to avoid hydration issues in Next.js

const WAIT_MESSAGES = [
  "Learn the art of flirting with AI.",
  "Impress your crush with the perfect flirt.",
  "Discover the secrets of charming conversations.",
  "Flirt your way to success with AI.",
  "Unleash your inner flirt with AI magic.",
];

function AuthLoading() {
  const options = {
    animationData,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);

  const [text] = useTypewriter({
    words: WAIT_MESSAGES,
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 10,
  });

  return (
    <div className="auth-loading">
      <div className="loading-animation">{View}</div>
      <p className="wait-text" suppressHydrationWarning={true}>
        {text}
        <Cursor cursorColor="#ff1694" />
      </p>
    </div>
  );
}

export default AuthLoading;
