"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        // Redirect to the Todo List if logged in
        router.push("/todos");
      } else {
        // Redirect to the Auth page if not logged in
        router.push("/auth");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
    }}>
      <div style={{
        textAlign: "center",
        padding: "30px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%",
      }}>
        <h1 style={{
          fontSize: "2rem",
          color: "#007bff",
          marginBottom: "20px",
        }}>
          Welcome to the To-Do App!
        </h1>
        <p style={{
          fontSize: "1rem",
          color: "#555",
          marginBottom: "20px",
        }}>
          Redirecting you to the appropriate page...
        </p>
       
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
